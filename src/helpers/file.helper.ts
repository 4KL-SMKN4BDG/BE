import fs from 'fs';
export function removeFile(filepath: string) {
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    return true;
}