export interface Config {
  // events?: {
  //   [key: string]: {
  //     tags: string[]
  //   }
  // },
  modules?: Array<Module>
}

export interface Module {
  head?: () => MetaInfo,
  init?: () => any | Promise<any>
}

export interface MetaInfo {
  script: Array<{
    async?: boolean,
    src?: string
  }>
}