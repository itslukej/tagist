import { Module } from "../interfaces";

declare global {
  interface Window {
    dataLayer: Array<any>,
    gtag: (...args: any) => any,
  }
}

export class GoogleAnalytics implements Module {
  private queue: Array<Array<any>> = [];

  constructor(public measurementID: string) {}

  head() {
    return {
      script: [
        {
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${this.measurementID}`
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

    this.pushDataLayer('config', this.measurementID);

    if (pushQueue) {
      window.dataLayer.push(...this.queue);
      this.queue = []
    }
  }

  pushDataLayer(...args: any) {
    (window.dataLayer || this.queue).push(args);

    return this;
  }

  event(action: string, category?: string, label?: string) {
    this.pushDataLayer('event', action, {
      'event_category': category,
      'event_label': label
    });

    return this;
  }
}

export default function googleAnalytics(measurementID: string) {
  return new GoogleAnalytics(measurementID);
}