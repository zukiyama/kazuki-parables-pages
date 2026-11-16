export type ArcadeLaunchGame = {
  url: string | null;
  orientation: "portrait" | "landscape";
};

/** Only a playable phone game that explicitly needs landscape may rotate the display. */
export const shouldRequestLandscape = (game: ArcadeLaunchGame, isPhone: boolean) =>
  isPhone && Boolean(game.url) && game.orientation === "landscape";

/** Only the active, same-origin game frame may ask the cabinet to close. */
export const isArcadeQuitMessage = (
  event: { origin: string; source: unknown; data: unknown },
  origin: string,
  gameWindow: unknown,
) => {
  if (!gameWindow || event.origin !== origin || event.source !== gameWindow) return false;
  const data = event.data;
  return typeof data === "object" && data !== null &&
    "source" in data && data.source === "kazuki-and-kizuki" &&
    "type" in data && data.type === "quit";
};
