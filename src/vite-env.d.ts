/// <reference types="vite/client" />

declare module '*.scss?inline' {
  const content: string;
  export default content;
}

// Extend global event maps with custom events used throughout the application
declare global {
  interface DocumentEventMap {
    'donate-click': CustomEvent<void>;
  }

  interface HTMLElementEventMap {
    'donate-click': CustomEvent<void>;
    'amount-select': CustomEvent<{ label: string }>;
    'zoo-click': CustomEvent<{ variant: string; label: string; href: string | null }>;
    'live-badge-click': CustomEvent<void>;
  }
}
