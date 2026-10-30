export type ComicsLayout = {
  tabletPortraitStrip: boolean;
  landscapeStripHidden: boolean;
  popUpScene: boolean;
};

/** Keep the current Comics presentation while the visual viewport is zoomed. */
export function getComicsLayout(
  width: number,
  height: number,
  viewportScale: number,
  previous?: ComicsLayout,
): ComicsLayout {
  if (previous && Math.abs(viewportScale - 1) > 0.01) return previous;

  return {
    tabletPortraitStrip: width >= 768 && height > width,
    landscapeStripHidden: width > 820 && width > height,
    popUpScene: width >= 768 && height >= 600,
  };
}