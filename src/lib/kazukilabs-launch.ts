export type ArcadeLaunchGame = {
  url: string | null;
  orientation: "portrait" | "landscape";
};

/** Only a playable phone game that explicitly needs landscape may rotate the display. */
export const shouldRequestLandscape = (game: ArcadeLaunchGame, isPhone: boolean) =>
  isPhone && Boolean(game.url) && game.orientation === "landscape";

/** Cabinet layout measurements must exclude its active CSS zoom transform. */
export const getCabinetZoom = (
  layout: { left: number; top: number; screenLeft: number; screenTop: number; screenWidth: number; screenHeight: number },
  viewport: { width: number; height: number },
) => {
  if (layout.screenWidth <= 0 || layout.screenHeight <= 0) return null;
  const scale = Math.min(viewport.width * 0.9 / layout.screenWidth, viewport.height * 0.86 / layout.screenHeight);
  const x = viewport.width / 2 - layout.left - scale * (layout.screenLeft + layout.screenWidth / 2);
  const y = viewport.height / 2 - layout.top - scale * (layout.screenTop + layout.screenHeight / 2);
  return `translate(${x}px, ${y}px) scale(${scale})`;
};

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
