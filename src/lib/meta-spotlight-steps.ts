export type SpotlightWorkStep =
  | "facebook"
  | "instagram-children"
  | "instagram-wait"
  | "instagram-parent"
  | "instagram-publish"
  | "done";

export function nextSpotlightWork(input: {
  wantFacebook: boolean;
  wantInstagram: boolean;
  facebookId?: string;
  instagramId?: string;
  instagramChildIds?: string[];
  instagramParentId?: string;
  imageCount: number;
  childrenFinished: boolean;
  parentFinished: boolean;
}): SpotlightWorkStep {
  const facebookDone = !input.wantFacebook || Boolean(input.facebookId);
  const instagramDone = !input.wantInstagram || Boolean(input.instagramId);
  if (facebookDone && instagramDone) return "done";
  if (!facebookDone) return "facebook";

  const carousel = input.imageCount >= 2;
  const childIds = input.instagramChildIds ?? [];
  if (childIds.length === 0) return "instagram-children";
  if (!input.childrenFinished) return "instagram-wait";
  if (carousel && !input.instagramParentId) return "instagram-parent";
  if (carousel && !input.parentFinished) return "instagram-wait";
  return "instagram-publish";
}
