require('@testing-library/jest-dom')


const React = require('react');
if (typeof React.cache !== 'function') {
    React.cache = (fn) => fn;
}

async function streamToString(stream) {
    const reader = stream.getReader();
    let chunks = "";
    const decoder = new TextDecoder("utf-8");
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks += decoder.decode(value, { stream: true });
    }
    chunks += decoder.decode();

    return chunks;
}


