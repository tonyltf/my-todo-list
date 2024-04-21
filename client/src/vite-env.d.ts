/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_USER_ID_COOKIES_NAME: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}