<p align="left" >
<a href='https://carbonplan.org'>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://carbonplan-assets.s3.amazonaws.com/monogram/light-small.png">
  <img alt="CarbonPlan monogram." height="48" src="https://carbonplan-assets.s3.amazonaws.com/monogram/dark-small.png">
</picture>
</a>
</p>

# carbonplan / leap-stories

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This repository contains interactive stories made in collaboration with [LEAP](https://leap.columbia.edu/). Stories and their interactive figures are included directly in this repository within the [`pages/stories/`](/pages/stories) subfolder.

The site is a [Next.js](https://nextjs.org/) project, deployed on [Vercel](https://vercel.com/).

## usage

To run locally

```js
npm install
npm run dev
```

and then visit `http://localhost:4000/` in your browser.

### new stories

New stories should be added to `pages/stories/` with the story content and `metadata` exported from `pages/stories/{story-name}/index.page.mdx`. See [`pages/stories/ocean-sink/index.page.mdx`](/pages/stories/ocean-sink/index.page.mdx) for an example of how exports should be laid out.

## license

All the code in this repository is [MIT](https://choosealicense.com/licenses/mit/)-licensed, but we request that you please provide attribution if reusing any of our digital content (graphics, logo, articles, etc.).

## about us

CarbonPlan is a nonprofit organization that uses data and science for climate action. We aim to improve the transparency and scientific integrity of climate solutions with open data and tools. Find out more at [carbonplan.org](https://carbonplan.org/) or get in touch by [opening an issue](https://github.com/carbonplan/simple-site/issues/new) or [sending us an email](mailto:hello@carbonplan.org).
