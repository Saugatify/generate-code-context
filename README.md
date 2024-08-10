# Generate Code Context of your Project

This npm package reads all files in a directory (excluding specified ones) and writes their contents to a `.txt` file.

## Installation

```sh
npm i generate-code-context
```
## Usuage

Create a file named generate.js in your project directory.

Add the following code to generate.js:

``` sh


const { run } = require('generate-code-context');
const path = require('path');
const startDir = __dirname; // Root directory
const excludeDirs = ['node_modules', 'dist', 'build'];
const excludeFiles = ['package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
const outputFilePath = path.join(__dirname, 'code_context.txt'); // Save in root directory
run(startDir, excludeDirs, excludeFiles, outputFilePath);
```

Get Gemini API Key from https://aistudio.google.com 
and paste it in .env file

``` sh

API_KEY=your_google_api_key_here

```


## RUN
``` sh
node generate.js

```
