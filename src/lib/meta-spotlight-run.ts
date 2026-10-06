import type { Locale } from "@/i18n/config";
import {
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
import {
  buildTodayMetaPost,
  sameSpotlightEventSet,
  spotlightPickOptionsForSource,
  type SpotlightChannel,
} from "@/lib/meta-spotlight";
import { localDateISO } from "@/lib/event-dates";
import {
  claimTodaySpotlightLock,
  finishTodaySpotlightLock,
  mergeSpotlightExclusions,
  readSpotlightLocks,
  spotlightInstagramComplete,
  type SpotlightLockRecord,
} from "@/lib/meta-spotlight-lock";
import { nextSpotlightWork } from "@/lib/meta-spotlight-steps";

export type TodaySpotlightProgress = {
  facebookId?: string;
  instagramId?: string;
  instagramIds?: string[];
  instagramPostedEventIds?: string[];
  instagramChildIds?: string[];
  caption?: string;
  eventCaptions?: string[];
  imageUrls?: string[];
  /** @deprecated Reels path. Image posts use `imageUrls`. */
  videoUrls?: string[];
  link?: string;
  eventIds?: string[];
};

export type TodaySpotlightStepResult = {
  success: boolean;
  done: boolean;
  reused?: boolean;
  skipped?: boolean;
  inProgress?: boolean;
  phase?: string;
  eventIds: string[];
  caption?: string;
  eventCaptions?: string[];
  imageUrls?: string[];
  videoUrls?: string[];
  link?: string;
  facebook?: { ok: true; id: string } | { ok: false; error: MetaGraphError };
  instagram?: { ok: true; id: string } | { ok: false; error: MetaGraphError };
  instagramIds?: string[];
  instagramPostedEventIds?: string[];
  instagramChildIds?: string[];
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

function nextUnpostedEventIndex(
  eventIds: string[],
  posted: string[],
): number {
  const done = new Set(posted);
  return eventIds.findIndex((id) => !done.has(id));
}

function uniqueUrls(urls: string[]): string[] {
  const out: string[] = [];
  for (const url of urls) {
    if (url && !out.includes(url)) out.push(url);
  }
  return out;
}

export async function runTodaySpotlightStep(input: {
  config: MetaPostConfig;
  locale: Locale;
  wantFacebook: boolean;
  wantInstagram: boolean;
  force?: boolean;
  featureEventId?: string;
  /** Never pick these ids on this run (still allows the rest of the day). */
  excludeEventIds?: string[];
  channel?: SpotlightChannel;
  progress?: TodaySpotlightProgress;
}): Promise<{ status: number; body: TodaySpotlightStepResult }> {
  const channel = input.channel ?? "today";
  const today = localDateISO();
  const locks = await readSpotlightLocks();
  const own: SpotlightLockRecord | null =
    channel === "today-specials" ? locks.specials : locks.today;
  const other =
    channel === "today-specials" ? locks.today : locks.specials;
  const specialsAlreadyPosted =
    channel === "today" &&
    Boolean(
      locks.specials &&
        locks.specials.date === today &&
        locks.specials.status !== "failed" &&
        locks.specials.eventIds.length > 0,
    );
  const exclusions = mergeSpotlightExclusions(own, [other], today, {
    force: input.force,
  });
  const excludeEventIds = (input.excludeEventIds ?? [])
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  const built = await buildTodayMetaPost(input.locale, undefined, {
    ...exclusions,
    hardExcludeIds: [...exclusions.hardExcludeIds, ...excludeEventIds],
    featureEventId: input.featureEventId,
    ...spotlightPickOptionsForSource(channel, { specialsAlreadyPosted }),
  });
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
  if (
    channel === "today" &&
    other?.date === today &&
    sameSpotlightEventSet(eventIds, other.eventIds)
  ) {
    return {
      status: 200,
      body: {
        success: true,
        done: true,
        skipped: true,
        phase: "skipped-duplicate",
        eventIds,
        error: "Scheduled spotlight matches today's specials post",
      },
    };
  }

  const claimed = await claimTodaySpotlightLock({
    locale: input.locale,
    eventIds,
    repeatKeys: built.post.repeatKeys,
    caption: built.post.caption,
    eventCaptions: built.post.eventCaptions,
    imageUrls: built.post.imageUrls,
    videoUrls: input.progress?.videoUrls,
    link: built.post.link,
    force: input.force,
    facebook: input.wantFacebook,
    instagram: input.wantInstagram,
    channel,
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
        eventCaptions: claimed.record.eventCaptions,
        imageUrls: claimed.record.imageUrls,
        videoUrls: claimed.record.videoUrls,
        link: claimed.record.link,
        facebook: channelResult(claimed.record.facebookId),
        instagram: channelResult(claimed.record.instagramId),
        instagramIds: claimed.record.instagramIds,
        instagramPostedEventIds: claimed.record.instagramPostedEventIds,
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
        instagramIds: claimed.record.instagramIds,
        instagramPostedEventIds: claimed.record.instagramPostedEventIds,
        instagramChildIds: claimed.record.instagramChildIds,
        videoUrls: claimed.record.videoUrls,
      },
    };
  }

  const record = claimed.action === "skip" ? undefined : claimed.record;
  const progress = input.progress ?? {};
  const caption = record?.caption ?? progress.caption ?? built.post.caption;
  const eventCaptions = record?.eventCaptions?.length
    ? record.eventCaptions
    : progress.eventCaptions?.length
      ? progress.eventCaptions
      : built.post.eventCaptions;
  const imageUrls = record?.imageUrls?.length
    ? record.imageUrls
    : progress.imageUrls?.length
      ? progress.imageUrls
      : built.post.imageUrls;
  const videoUrls = progress.videoUrls?.length
    ? progress.videoUrls
    : (record?.videoUrls ?? []);
  const link = record?.link ?? progress.link ?? built.post.link;
  const jobEventIds = record?.eventIds.length
    ? record.eventIds
    : progress.eventIds?.length
      ? progress.eventIds
      : eventIds;
  const job = {
    caption,
    eventCaptions,
    imageUrls,
    videoUrls,
    link,
    eventIds: jobEventIds,
    facebookId: record?.facebookId ?? progress.facebookId,
    instagramId: record?.instagramId ?? progress.instagramId,
    instagramIds: record?.instagramIds ?? progress.instagramIds ?? [],
    instagramPostedEventIds:
      record?.instagramPostedEventIds ??
      progress.instagramPostedEventIds ??
      [],
    instagramChildIds: record?.instagramChildIds ?? progress.instagramChildIds,
  };

  const persist = async (patch: {
    facebookId?: string;
    instagramId?: string;
    instagramIds?: string[];
    instagramPostedEventIds?: string[];
    instagramChildIds?: string[] | null;
    videoUrls?: string[];
    failed?: boolean;
    complete?: boolean;
  }) => {
    const nextChildIds =
      patch.instagramChildIds === null
        ? []
        : (patch.instagramChildIds ?? job.instagramChildIds);
    await finishTodaySpotlightLock({
      locale: input.locale,
      eventIds: job.eventIds,
      caption: job.caption,
      eventCaptions: job.eventCaptions,
      imageUrls: job.imageUrls,
      videoUrls: patch.videoUrls ?? job.videoUrls,
      link: job.link,
      facebookId: patch.facebookId ?? job.facebookId,
      instagramId: patch.instagramId ?? job.instagramId,
      instagramIds: patch.instagramIds ?? job.instagramIds,
      instagramPostedEventIds:
        patch.instagramPostedEventIds ?? job.instagramPostedEventIds,
      instagramChildIds: nextChildIds,
      failed: patch.failed,
      complete: patch.complete,
      channel,
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
        eventCaptions: job.eventCaptions,
        imageUrls: job.imageUrls,
        videoUrls: job.videoUrls,
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

  const creationId = job.instagramChildIds?.[0];
  let creationFinished = false;
  if (creationId && !spotlightInstagramComplete(job)) {
    const statuses = await readInstagramContainerStatuses(config, [creationId]);
    if (!statuses.ok) {
      const fail = graphFail(statuses.error);
      await persist({
        failed: isMetaRateLimitError(statuses.error) ? false : true,
      });
      return {
        status: fail.status,
        body: { ...fail.body, done: false, eventIds: job.eventIds },
      };
    }
    const failed = instagramContainerFailure([creationId], statuses.statuses);
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
    creationFinished = instagramContainersFinished(
      [creationId],
      statuses.statuses,
    );
  }

  const step = nextSpotlightWork({
    wantFacebook: input.wantFacebook,
    wantInstagram: input.wantInstagram,
    facebookId: job.facebookId,
    eventCount: job.eventIds.length,
    instagramPostedCount: job.instagramPostedEventIds.length,
    instagramCreationId: creationId,
    creationFinished,
  });

  const base = (): TodaySpotlightStepResult => ({
    success: true,
    done: false,
    inProgress: true,
    eventIds: job.eventIds,
    caption: job.caption,
    eventCaptions: job.eventCaptions,
    imageUrls: job.imageUrls,
    videoUrls: job.videoUrls,
    link: job.link,
    facebook: channelResult(job.facebookId),
    instagram: channelResult(job.instagramId),
    instagramIds: job.instagramIds,
    instagramPostedEventIds: job.instagramPostedEventIds,
    instagramChildIds: job.instagramChildIds,
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
      imageUrls: uniqueUrls(job.imageUrls),
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
    const complete =
      !input.wantInstagram ||
      spotlightInstagramComplete({
        eventIds: job.eventIds,
        instagramId: job.instagramId,
        instagramPostedEventIds: job.instagramPostedEventIds,
      });
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

  if (step === "instagram-create") {
    const index = nextUnpostedEventIndex(
      job.eventIds,
      job.instagramPostedEventIds,
    );
    if (index < 0) {
      await persist({ complete: true });
      return {
        status: 200,
        body: { ...base(), done: true, inProgress: false, phase: "done" },
      };
    }
    const imageUrl = job.imageUrls[index]?.trim();
    const eventCaption = job.eventCaptions?.[index] ?? job.caption;
    if (!imageUrl) {
      await persist({ failed: true });
      return {
        status: 502,
        body: {
          success: false,
          done: false,
          eventIds: job.eventIds,
          error: `Missing image for event ${job.eventIds[index] ?? index}`,
        },
      };
    }
    const created = await createInstagramMediaContainers(config, {
      imageUrls: [imageUrl],
      caption: eventCaption,
      carousel: false,
    });
    if (!created.ok) {
      const fail = graphFail(created.error);
      await persist({ failed: true });
      return {
        status: fail.status,
        body: { ...fail.body, done: false, eventIds: job.eventIds },
      };
    }
    const creationId = created.ids[0];
    if (!creationId) {
      await persist({ failed: true });
      return {
        status: 502,
        body: {
          success: false,
          done: false,
          eventIds: job.eventIds,
          error: "Instagram container missing id",
        },
      };
    }
    job.instagramChildIds = [creationId];
    await persist({ instagramChildIds: [creationId] });
    return {
      status: 200,
      body: {
        ...base(),
        instagramChildIds: [creationId],
        phase: "instagram-create",
      },
    };
  }

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

  const index = nextUnpostedEventIndex(
    job.eventIds,
    job.instagramPostedEventIds,
  );
  const postedEventId =
    index >= 0 ? job.eventIds[index] : job.eventIds[job.eventIds.length - 1];
  const nextPosted = postedEventId
    ? [...job.instagramPostedEventIds, postedEventId]
    : job.instagramPostedEventIds;
  const nextIds = [...job.instagramIds, instagram.id];
  job.instagramId = instagram.id;
  job.instagramIds = nextIds;
  job.instagramPostedEventIds = nextPosted;
  job.instagramChildIds = [];

  const complete = spotlightInstagramComplete({
    eventIds: job.eventIds,
    instagramId: job.instagramId,
    instagramPostedEventIds: nextPosted,
  });
  await persist({
    instagramId: instagram.id,
    instagramIds: nextIds,
    instagramPostedEventIds: nextPosted,
    instagramChildIds: null,
    complete,
  });
  return {
    status: 200,
    body: {
      ...base(),
      instagram: { ok: true, id: instagram.id },
      instagramIds: nextIds,
      instagramPostedEventIds: nextPosted,
      instagramChildIds: [],
      done: complete,
      inProgress: !complete,
      phase: complete ? "instagram-publish" : "instagram-next",
    },
  };
}
