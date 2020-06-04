<div class="header" align="center">
  <h1>npm-utilities</h1>
  <p>The most <b>complete</b>, <b>powerful</b> and <b>flexible</b> npm module to retrieve package, user and status data from npmjs.com programmatically with the power of web scraping!</p>
  <a href="https://www.npmjs.com/package/npm-utilities">
    <img src="https://img.shields.io/hexpm/l/npm-utilities?label=License">
  </a>
  <a href="https://www.npmjs.com/package/npm-utilities">
      <img src="https://img.shields.io/badge/npmjs-mahdios%2Fnpm--utilities-red">
  </a>
  <a href="https://github.com/Mahdios/npm-utilities">
    <img src="https://img.shields.io/badge/Github-Mahdios%2Fnpm--utilities-lightgrey">
  </a>
</div>

<h4>Github : <a href="https://www.github.com/Mahdios/npm-utilities"><img src="https://img.shields.io/github/forks/Mahdios/npm-utilities?style=social"></a><a href="https://www.github.com/Mahdios/npm-utilities"><img src="https://img.shields.io/github/stars/Mahdios/npm-utilities?style=social"></a><a href="https://www.github.com/Mahdios/npm-utilities"><img src="https://img.shields.io/github/watchers/Mahdios/npm-utilities?style=social"></a></h4>
<h4>Npmjs :   
  <a href="https://www.npmjs.com/package/npm-utilities"><img src="https://img.shields.io/bundlephobia/min/npm-utilities?label=Size"></a> <a href="https://www.npmjs.com/package/npm-utilities"><img src="https://img.shields.io/npm/dw/npm-utilities?label=Downloads"></a>
</h4>

<h4>Docs : <a href="https://npm-utilities.mahdios.gq">
    <img src="https://img.shields.io/website?down_message=Offline&label=Status&up_color=green&up_message=Online&url=https://npm-utilities.mahdios.gq">
</a></h4>

## Why?
- Does anything you can do manually.
- Implements the latest ES6 syntax.
- Asynchronous behavior.
- Easy to use yet powerful.
- Search for packages, retrieve full package (with version support)/user info as at appears on the website.
- Fully documented with examples.
- Open source.

## Getting started
1 - Run `npm i npm-utilities` on the root of your preferred project.

2 - Require what you need
```JavaScript
// Using the package class
const { Package } = require('npm-utilities');
const upjson = new Package('upjson');
upjson.snippet().then(console.log).catch(console.error);
```
3 - Be creative with the [docs](https://npm-utilities.mahdios.gq)!

## Contributing
Any sort of contributing is **welcome** in the following cases:

<div align="center">
  <p>- Finding a bug (on the docs, package or the github page)  , open an issue or fix it yourself and open a pr.</p>

  <p>- Some sort of a feature (available on the website) you want is missing , open an issue.</p>
</div>

## Copyright
This work is licensed under the Apache 2.0 license . All rights reserved to their respective owners.

<div align="center">
 <img src="https://nodei.co/npm/npm-utilities.png?downloads=true&downloadRank=true&stars=true">
</div>
