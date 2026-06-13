/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute URL of the deployed contact-form function (see .env.example). */
  readonly VITE_CONTACT_ENDPOINT?: string
  /** Absolute URL of the deployed Spotify now-playing function. */
  readonly VITE_NOWPLAYING_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
