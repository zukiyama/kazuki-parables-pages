import React from 'react';

export type RevealSegment = { text: string; em?: boolean };

interface WordRevealProps {
  segments: RevealSegment[];
  /** Index of the first word, so several paragraphs can continue one cascade. */
  startIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Splits a paragraph into word spans that cascade in via CSS (`.comics-reveal-word`). */
export const countWords = (segments: RevealSegment[]) =>
  segments.reduce((n, s) => n + s.text.split(/\s+/).filter(Boolean).length, 0);

export const WordReveal: React.FC<WordRevealProps> = ({ segments, startIndex = 0, className, style }) => {
  let i = startIndex;
  const nodes: React.ReactNode[] = [];
  segments.forEach((segment, si) => {
    const words = segment.text.split(/(\s+)/);
    words.forEach((word, wi) => {
      if (!word) return;
      if (/^\s+$/.test(word)) {
        nodes.push(' ');
        return;
      }
      const span = (
        <span
          key={`${si}-${wi}`}
          className="comics-reveal-word"
          style={{ '--w': i } as React.CSSProperties}
        >
          {word}
        </span>
      );
      nodes.push(segment.em ? <em key={`e${si}-${wi}`}>{span}</em> : span);
      i += 1;
    });
  });
  return (
    <p className={className} style={style}>
      {nodes}
    </p>
  );
};
