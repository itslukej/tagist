import tagist, { modules } from '../lib';

// @ts-expect-error
global.window = {};

const enum GoogleConversionIds {
  PAGEVIEW = 'aaabbbccc'
}

const t = tagist({
  modules: [
    modules.googleAnalytics('G-1'),
    modules.googleAds('AW-1')
      .conversion(GoogleConversionIds.PAGEVIEW) // Insantly mark a pageview as a conversion if you want to do so
  ]
});

console.log('Headers', t.head()) // t.head() is vue-meta compliant

t.init().then(() => {
  console.log('Window', window)
  console.log(JSON.stringify(window.dataLayer))
})