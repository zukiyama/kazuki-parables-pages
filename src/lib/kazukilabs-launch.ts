export type ArcadeLaunchGame = {
  url: string | null;
  orientation: "portrait" | "landscape";
};

/** Only a playable phone game that explicitly needs landscape may rotate the display. */
export const shouldRequestLandscape = (game: ArcadeLaunchGame, isPhone: boolean) =>
  isPhone && Boolean(game.url) && game.orientation === "landscape";
