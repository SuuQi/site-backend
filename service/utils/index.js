
import fs from 'fs';
import crypto from 'crypto';

export function readJSON (jsonPath) {
    return JSON.parse( fs.readSync(jsonPath) );
}

export function md5 (str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

export function generateMd5String (url) {
    return `${moment().format('YYYYMMDD')}${md5(url).slice(0, 8)}`;
}
