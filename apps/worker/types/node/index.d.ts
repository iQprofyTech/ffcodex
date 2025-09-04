// Minimal stub to satisfy TypeScript when it cannot resolve @types/node locally.
// Real Node types are still used in Docker builds from root node_modules.
declare namespace NodeJS {
  interface ProcessEnv { [key: string]: string | undefined }
}

