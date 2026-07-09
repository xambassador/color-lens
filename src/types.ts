export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch" | "hwb";

export interface CSSColorVar {
  name: string;
  /** Current live value */
  value: string;
  /** Captured value at scan time */
  original: string;
  modified: boolean;
  /** All unique color values found for this property across all rules */
  variants: string[];
  /** Total number of times this property was encountered in stylesheets */
  count: number;
  /** Currently computed active value from getComputedStyle */
  activeVariant: string;
}

export interface Group {
  label: string;
  vars: CSSColorVar[];
  modifiedCount: number;
}

export type WCAG_LEVEL = "AAA" | "AA" | "fail";

export interface PersistedPanelState {
  pos?: { x: number; y: number };
  size?: { w: number; h: number };
}

declare global {
  interface Window {
    __colorlens__?: {
      show(): void;
      hide(): void;
      reset(): void;
    };
  }
}
