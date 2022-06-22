import { Module } from "../interfaces";

declare global {
  interface Window {
    dataLayer: Array<any>,
    gtag: (...args: any) => any,
  }
}

export class GoogleAds implements Module {
  private queue: Array<Array<any>> = [];

  constructor(public conversionID: string) {}

  head() {
    return {
      script: [
        {
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${this.conversionID}`
        }
      ]
    }
  }

  init() {
    let pushQueue = false;

    if (window.dataLayer) {
      pushQueue = true;
    } else {
      window.dataLayer = [];
    }

    if (!window.gtag) {
      window.gtag = this.pushDataLayer;
  
      this.pushDataLayer('js', new Date());
    }

    this.pushDataLayer('config', this.conversionID);

    if (pushQueue) {
      window.dataLayer.push(...this.queue);
      this.queue = []
    }
  }

  pushDataLayer(...args: any) {
    (window.dataLayer || this.queue).push(args)

    return this;
  }

  conversion(sendTo: string) {
    this.pushDataLayer('event', 'conversion', { 'send_to': sendTo });

    return this;
  }
}

export default function googleAds(conversionID: string) {
  return new GoogleAds(conversionID);
}