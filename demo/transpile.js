import fs from 'fs';
import path from 'path';
import babel from '@babel/core';

const inputPath = path.join('./public/script/module/GamePage.jsx');
const outputPath = path.join('./public/script/GamePage.js');

const jsxCode = fs.readFileSync(inputPath, 'utf-8');

const { code } = babel.transformSync(jsxCode, {
   presets: ["@babel/preset-env", "@babel/preset-react"]
});

fs.writeFileSync(outputPath, code, 'utf-8');

console.log(`Transpiled JSX to ${outputPath}`);