import { Config, MetaInfo, Module } from './interfaces';

export * as modules from './modules';

export class Tagist {
  modules: Module[];

  constructor(config: Config) {
    this.modules = config.modules || [];
  }

  head(): MetaInfo {
    const heads = this.modules.filter(m => m.head).map(m => m.head());

    let gtag = false

    return {
      script: []
        .concat(...heads.map(h => h.script || []))
        // Only allow for one gtag script
        .filter(s => {
          if (s.src && s.src.startsWith('https://www.googletagmanager.com/gtag/js') && !gtag) {
            gtag = true;
            return true;
          }

          return false;
        })
    }
  }

  async init() {
    for (const module of this.modules) {
      if (module.init) await module.init();
    }
  }
}

export default function tagist(config: Config) {
  return new Tagist(config);
}