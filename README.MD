# pandoc-ts

![Support Node of LTS](https://img.shields.io/badge/node-LTS-brightgreen.svg?style=plastic) ![npm version](https://img.shields.io/badge/npm-7.16.0-brightgreen.svg?style=plastic) ![Build passing](https://img.shields.io/badge/build-passing%20Typescript-brightgreen.svg?style=plastic) ![Support](https://img.shields.io/badge/support-javascript%20|%20typescript-brightgreen.svg?style=plastic) ![dependencies pandoc](https://img.shields.io/badge/dependencies-pandoc-blue.svg?style=plastic) ![License mit](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)

---

# Description

**pandoc-ts** is a pure typescript wrapper for nodejs of [pandoc](https://pandoc.org). Main purpose of this library is to provide synchronous and asynchronous methods to convert documents in all formats supported by pandoc.

# How to use

## Install dependencies:

You need to install `pandoc` and add it to the system `path` to use this library.  
To install pandoc follow the official procedure at [https://pandoc.org/installing.html](https://pandoc.org/installing.html)

## Import in node js

After `pandoc` is installed, simple run:

```sh
npm install --save pandoc-ts
```

or

```sh
yarn add pandoc-ts
```

## Use in your project

**Typescript**

```ts
import { Pandoc, PandocOutFormat, PandocData } from "pandoc-ts";
```

**Javascript**

```js
const pandoc = require("pandoc-ts");
const Pandoc = pandoc.Pandoc;
const PandocOutFormat = pandoc.PandocOutFormat;
const PandocData = pandoc.PandocData;
```

## Configuration

To use corverter you have to configure the output format you need and create an instance of converter.

**Typescript**

```ts
const outFormats: PandocOutFormat[] = [
  {
    name: String,
    format: String,
    fname: String,
    outBin: Boolean,
    enc: String,
  },
  ...
];
const pandocInstance = new Pandoc('format', outFormats);
```

```js
const outFormats = [
  {
    name: String,
    format: String,
    fname: String,
    outBin: Boolean,
    enc: String,
  },
  ...
];
const pandocInstance = new Pandoc('format', outFormats);
```

Where:

- **name**: friendly name for the output
- **format**: Pandoc format name for input or output see [here](https://pandoc.org/MANUAL.html#general-options) for more details
- **fname**: define the output file name for current format
- **outBin**: if true the current format output will be returned in raw buffer format
- **enc**: if _outBin_ is false and _fname_ is not defined set the output content encoding. For more information see [here](https://nodejs.org/dist./v4.8.3/docs/doc/api/buffer.html#buffer_buffers_and_character_encodings)

> **outFormats**: could also be single object rather than an array

## Convert

Now you can call conversion function in the instance you created.

**Typescript**

```ts
pandocInstance.convert("text", callback);
pandocInstance.convertFile("file-name", callback);

// or async

const result: PandocData = await pandocInstance.convertAsync("text");
const result: PandocData = await pandocInstance.convertFileAsync("file-name");
```

**Javascript**

```js
pandocInstance.convert("text", callback);
pandocInstance.convertFile("file-name", callback);

// or async

const result = await pandocInstance.convertAsync("text");
const result = await pandocInstance.convertFileAsync("file-name");
```

Where:

- **text**: string text to convert in the specific format
- **file-name**: name of the file to convert
- **callback**: function to call when the operation is completed

> Callback signature: `(data: PandocData, err: Error | null) => void`  
> where data is a PandocData value and Error is [Nodejs Error](https://nodejs.org/api/errors.html#errors_class_error)

**PandocData** is defined as `{ [format: string]: string | Buffer } | null`.  
A nullable key value-value pair where key is the name of the out format and value is the result of coversion.

## Example

In this sample we convert a docx file (input.docx) in two format.

- gfm (github markdown)
- html

First one will be converted in utf-8 string (as default) and shown in console  
The second saved in an output file "sample.html"

```ts
import { Pandoc, PandocOutFormat } from "pandoc-ts";

const outs: PandocOutFormat[] = [
  { name: "markdown", name: "gfm", outBin: false },
  { name: "markdownFile", name: "gfm", fname: "sample.md" },
  { name: "html", name: "html", fname: "sample.html" },
];

const pandocInstance = new Pandoc("docx", outs);

pandocInstance.convertFile("input.docx", (result, err) => {
  if (err) {
    console.error(err);
  }
  if (result) {
    console.log(result.markdown);
    console.log(result.markdownFile);
    console.log(result.html);
  }
});
```
