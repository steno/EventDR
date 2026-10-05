export type SpotlightWorkStep =
  | "facebook"
  | "instagram-create"
  | "instagram-wait"
  | "instagram-publish"
  | "done";

/**
 * Facebook stays one album. Instagram posts one individual event at a time
 * (no carousel): create → wait → publish, then repeat until every event is done.
 */
export function nextSpotlightWork(input: {
  wantFacebook: boolean;
  wantInstagram: boolean;
  facebookId?: string;
  eventCount: number;
  instagramPostedCount: number;
  /** Container id for the event currently being published. */
  instagramCreationId?: string;
  creationFinished: boolean;
}): SpotlightWorkStep {
  const facebookDone = !input.wantFacebook || Boolean(input.facebookId);
  const instagramDone =
    !input.wantInstagram ||
    (input.eventCount > 0 &&
      input.instagramPostedCount >= input.eventCount);
  if (facebookDone && instagramDone) return "done";
  if (!facebookDone) return "facebook";

  if (!input.instagramCreationId) return "instagram-create";
  if (!input.creationFinished) return "instagram-wait";
  return "instagram-publish";
}
