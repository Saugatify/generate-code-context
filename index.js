const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

function getFilesInDirectory(dir, excludeDirs, excludeFiles) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                results = results.concat(getFilesInDirectory(filePath, excludeDirs, excludeFiles));
            }
        } else {
            if (!excludeFiles.includes(path.basename(file))) {
                results.push(filePath);
            }
        }
    });

    return results;
}

function readFileContent(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function generateCodeContext(startDir, excludeDirs = [], excludeFiles = [], outputFilePath) {
    const files = getFilesInDirectory(startDir, excludeDirs, excludeFiles);
    fs.writeFileSync(outputFilePath, '', 'utf8');

    files.forEach(file => {
        const content = readFileContent(file);
        const fileContext = `File: ${file}\nContent:\n${content}\n-----------------------------------\n`;
        fs.appendFileSync(outputFilePath, fileContext, 'utf8');
    });

    console.log('Code context has been written to', outputFilePath);
}

async function summarizeCodeContext(outputFilePath) {
    const codeContext = fs.readFileSync(outputFilePath, 'utf8');
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-pro"
    });

    const prompt = `Provide me the detailed summary of this code and also help me understand this code:\n${codeContext}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    fs.appendFileSync(outputFilePath, `\nSummary:\n${text}\n`, 'utf8');
    console.log('Summary has been written to', outputFilePath);
}

async function run(startDir, excludeDirs, excludeFiles, outputFilePath) {
    console.log('Generating code context...');
    generateCodeContext(startDir, excludeDirs, excludeFiles, outputFilePath);

    console.log('Generating summary...');
    await summarizeCodeContext(outputFilePath);

    console.log('Process completed.');
}

module.exports = { run, generateCodeContext, summarizeCodeContext };
