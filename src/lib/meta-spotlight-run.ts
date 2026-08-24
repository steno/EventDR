import type { Locale } from "@/i18n/config";
import {
  createInstagramCarouselParent,
  createInstagramMediaContainers,
  instagramContainerFailure,
  instagramContainersFinished,
  isMetaRateLimitError,
  publishFacebookAlbum,
  publishInstagramCreation,
  readInstagramContainerStatuses,
  withPageAccessToken,
  type MetaGraphError,
  type MetaPostConfig,
} from "@/lib/meta-post";
import { buildTodayMetaPost } from "@/lib/meta-spotlight";
import {
  claimTodaySpotlightLock,
  finishTodaySpotlightLock,
} from "@/lib/meta-spotlight-lock";
import { nextSpotlightWork } from "@/lib/meta-spotlight-steps";

export type TodaySpotlightProgress = {
  facebookId?: string;
  instagramId?: string;
  instagramChildIds?: string[];
  instagramParentId?: string;
  caption?: string;
  imageUrls?: string[];
  link?: string;
  eventIds?: string[];
};

export type TodaySpotlightStepResult = {
  success: boolean;
  done: boolean;
  reused?: boolean;
  inProgress?: boolean;
  phase?: string;
  eventIds: string[];
  caption?: string;
  imageUrls?: string[];
  link?: string;
  facebook?: { ok: true; id: string } | { ok: false; error: MetaGraphError };
  instagram?: { ok: true; id: string } | { ok: false; error: MetaGraphError };
  instagramChildIds?: string[];
  instagramParentId?: string;
  error?: string;
  rateLimited?: boolean;
};

function channelResult(
  id: string | undefined,
): { ok: true; id: string } | undefined {
  return id ? { ok: true, id } : undefined;
}

function graphFail(error: MetaGraphError): {
  status: number;
  body: Pick<TodaySpotlightStepResult, "success" | "error" | "rateLimited">;
} {
  const rateLimited = isMetaRateLimitError(error);
  return {
    status: rateLimited ? 429 : 502,
    body: {
      success: false,
      error: error.message,
      rateLimited,
    },
  };
}

export async function runTodaySpotlightStep(input: {
  config: MetaPostConfig;
  locale: Locale;
  wantFacebook: boolean;
  wantInstagram: boolean;
  force?: boolean;
  progress?: TodaySpotlightProgress;
}): Promise<{ status: number; body: TodaySpotlightStepResult }> {
  const built = await buildTodayMetaPost(input.locale);
  if (!built.ok) {
    return {
      status: 422,
      body: {
        success: false,
        done: false,
        eventIds: [],
        error: built.error,
      },
    };
  }

  const eventIds = built.post.events.map((event) => event.id);
  const claimed = await claimTodaySpotlightLock({
    locale: input.locale,
    eventIds,
    caption: built.post.caption,
    imageUrls: built.post.imageUrls,
    link: built.post.link,
    force: input.force,
    facebook: input.wantFacebook,
    instagram: input.wantInstagram,
  });

  if (claimed.action === "reuse") {
    return {
      status: 200,
      body: {
        success: true,
        done: true,
        reused: true,
        phase: "reuse",
        eventIds: claimed.record.eventIds,
        caption: claimed.record.caption,
        imageUrls: claimed.record.imageUrls,
        link: claimed.record.link,
        facebook: channelResult(claimed.record.facebookId),
        instagram: channelResult(claimed.record.instagramId),
      },
    };
  }

  if (claimed.action === "wait") {
    return {
      status: 200,
      body: {
        success: true,
        done: false,
        inProgress: true,
        phase: "wait",
        eventIds: claimed.record.eventIds,
        facebook: channelResult(claimed.record.facebookId),
        instagram: channelResult(claimed.record.instagramId),
        instagramChildIds: claimed.record.instagramChildIds,
        instagramParentId: claimed.record.instagramParentId,
      },
    };
  }

  const record = claimed.action === "skip" ? undefined : claimed.record;
  const progress = input.progress ?? {};
  const caption = record?.caption ?? progress.caption ?? built.post.caption;
  const imageUrls =
    record?.imageUrls ?? progress.imageUrls ?? built.post.imageUrls;
  const link = record?.link ?? progress.link ?? built.post.link;
  const jobEventIds = record?.eventIds.length
    ? record.eventIds
    : progress.eventIds?.length
      ? progress.eventIds
      : eventIds;
  const job = {
    caption,
    imageUrls,
    link,
    eventIds: jobEventIds,
    facebookId: record?.facebookId ?? progress.facebookId,
    instagramId: record?.instagramId ?? progress.instagramId,
    instagramChildIds: record?.instagramChildIds ?? progress.instagramChildIds,
    instagramParentId: record?.instagramParentId ?? progress.instagramParentId,
  };

  const persist = async (patch: {
    facebookId?: string;
    instagramId?: string;
    instagramChildIds?: string[];
    instagramParentId?: string;
    failed?: boolean;
    complete?: boolean;
  }) => {
    await finishTodaySpotlightLock({
      locale: input.locale,
      eventIds: job.eventIds,
      caption: job.caption,
      imageUrls: job.imageUrls,
      link: job.link,
      facebookId: patch.facebookId ?? job.facebookId,
      instagramId: patch.instagramId ?? job.instagramId,
      instagramChildIds: patch.instagramChildIds ?? job.instagramChildIds,
      instagramParentId: patch.instagramParentId ?? job.instagramParentId,
      failed: patch.failed,
      complete: patch.complete,
    });
  };

  if (claimed.action === "proceed") {
    await persist({});
    return {
      status: 200,
      body: {
        success: true,
        done: false,
        inProgress: true,
        phase: "prepared",
        eventIds: job.eventIds,
        caption: job.caption,
        imageUrls: job.imageUrls,
        link: job.link,
      },
    };
  }

  const resolved = await withPageAccessToken(input.config);
  if (!resolved.ok) {
    const fail = graphFail(resolved.error);
    await persist({ failed: true });
    return {
      status: fail.status,
      body: { ...fail.body, done: false, eventIds: job.eventIds },
    };
  }
  const config = resolved.config;

  const statusIds = [
    ...(job.instagramChildIds ?? []),
    ...(job.instagramParentId ? [job.instagramParentId] : []),
  ];
  let childrenFinished = false;
  let parentFinished = false;
  if (statusIds.length && !job.instagramId) {
    const statuses = await readInstagramContainerStatuses(config, statusIds);
    if (!statuses.ok) {
      const fail = graphFail(statuses.error);
      await persist({ failed: isMetaRateLimitError(statuses.error) ? false : true });
      return {
        status: fail.status,
        body: { ...fail.body, done: false, eventIds: job.eventIds },
      };
    }
    const failed = instagramContainerFailure(statusIds, statuses.statuses);
    if (failed) {
      await persist({ failed: true });
      return {
        status: 502,
        body: {
          success: false,
          done: false,
          eventIds: job.eventIds,
          error: `Instagram container ${failed}`,
        },
      };
    }
    childrenFinished = instagramContainersFinished(
      job.instagramChildIds ?? [],
      statuses.statuses,
    );
    parentFinished = job.instagramParentId
      ? statuses.statuses[job.instagramParentId] === "FINISHED"
      : false;
  }

  const step = nextSpotlightWork({
    wantFacebook: input.wantFacebook,
    wantInstagram: input.wantInstagram,
    facebookId: job.facebookId,
    instagramId: job.instagramId,
    instagramChildIds: job.instagramChildIds,
    instagramParentId: job.instagramParentId,
    imageCount: job.imageUrls.length,
    childrenFinished,
    parentFinished,
  });

  const base = (): TodaySpotlightStepResult => ({
    success: true,
    done: false,
    inProgress: true,
    eventIds: job.eventIds,
    caption: job.caption,
    imageUrls: job.imageUrls,
    link: job.link,
    facebook: channelResult(job.facebookId),
    instagram: channelResult(job.instagramId),
    instagramChildIds: job.instagramChildIds,
    instagramParentId: job.instagramParentId,
  });

  if (step === "done") {
    await persist({ complete: true });
    return {
      status: 200,
      body: { ...base(), done: true, inProgress: false, phase: "done" },
    };
  }

  if (step === "instagram-wait") {
    await persist({});
    return { status: 200, body: { ...base(), phase: "instagram-wait" } };
  }

  if (step === "facebook") {
    const facebook = await publishFacebookAlbum(config, {
      caption: job.caption,
      imageUrls: job.imageUrls,
    });
    if (!facebook.ok) {
      const fail = graphFail(facebook.error);
      await persist({ failed: true });
      return {
        status: fail.status,
        body: {
          ...fail.body,
          done: false,
          eventIds: job.eventIds,
          facebook,
        },
      };
    }
    job.facebookId = facebook.id;
    const complete = !input.wantInstagram;
    await persist({ facebookId: facebook.id, complete });
    return {
      status: 200,
      body: {
        ...base(),
        facebook: { ok: true, id: facebook.id },
        done: complete,
        inProgress: !complete,
        phase: "facebook",
      },
    };
  }

  if (step === "instagram-children") {
    const created = await createInstagramMediaContainers(config, {
      imageUrls: job.imageUrls,
      caption: job.caption,
      carousel: job.imageUrls.length >= 2,
    });
    if (!created.ok) {
      const fail = graphFail(created.error);
      await persist({ failed: true });
      return {
        status: fail.status,
        body: { ...fail.body, done: false, eventIds: job.eventIds },
      };
    }
    job.instagramChildIds = created.ids;
    await persist({ instagramChildIds: created.ids });
    return {
      status: 200,
      body: {
        ...base(),
        instagramChildIds: created.ids,
        phase: "instagram-children",
      },
    };
  }

  if (step === "instagram-parent") {
    const parent = await createInstagramCarouselParent(config, {
      childIds: job.instagramChildIds ?? [],
      caption: job.caption,
    });
    if (!parent.ok) {
      const fail = graphFail(parent.error);
      await persist({ failed: true });
      return {
        status: fail.status,
        body: { ...fail.body, done: false, eventIds: job.eventIds },
      };
    }
    job.instagramParentId = parent.id;
    await persist({ instagramParentId: parent.id });
    return {
      status: 200,
      body: {
        ...base(),
        instagramParentId: parent.id,
        phase: "instagram-parent",
      },
    };
  }

  const creationId = job.instagramParentId ?? job.instagramChildIds?.[0];
  if (!creationId) {
    await persist({ failed: true });
    return {
      status: 502,
      body: {
        success: false,
        done: false,
        eventIds: job.eventIds,
        error: "Instagram publish missing creation id",
      },
    };
  }
  const instagram = await publishInstagramCreation(config, creationId);
  if (!instagram.ok) {
    const fail = graphFail(instagram.error);
    await persist({ failed: true });
    return {
      status: fail.status,
      body: {
        ...fail.body,
        done: false,
        eventIds: job.eventIds,
        instagram,
      },
    };
  }
  await persist({ instagramId: instagram.id, complete: true });
  return {
    status: 200,
    body: {
      ...base(),
      instagram: { ok: true, id: instagram.id },
      done: true,
      inProgress: false,
      phase: "instagram-publish",
    },
  };
}
