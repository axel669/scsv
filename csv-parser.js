const fs = require('fs');

const parseCSV = (filename, rowParser, cb) => {
    if (cb === undefined) {
        cb = rowParser;
        rowParser = i => i;
    }
    let inString = false;
    let lines = [];
    let currentLine = [];
    let currentElem = '';
    let prevch = null;
    const parseData = data => {
        for (const ch of data) {
            if (inString === true) {
                if (ch === '"' && prevch !== '"') {
                    inString = false;
                } else {
                    currentElem += ch;
                }
            } else {
                switch (true) {
                    case (ch === ','): {
                        currentLine.push(currentElem);
                        currentElem = '';
                        break;
                    }
                    case (ch === '"'): {
                        inString = true;
                        break;
                    }
                    case (ch === '\r'): {break;}
                    case (ch === '\n'): {
                        currentLine.push(currentElem);
                        lines.push(rowParser(currentLine));
                        currentLine = [];
                        currentElem = '';
                        break;
                    }
                    default: {
                        currentElem += ch;
                    }
                }
            }
            prevch = ch;
        }
    };
    const stream = fs.createReadStream(filename, {encoding: 'utf8'});
    stream.on(
        'data',
        parseData
    );
    stream.on('end', () => {
        if (currentElem !== '' || currentLine.length > 0) {
            currentLine.push(currentElem);
            lines.push(currentLine);
        }
        cb(lines);
    });
}
