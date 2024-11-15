import url from "url";
import path from "path";
export const currentDirname = (cureentImportMetaURL) => {
    const __filename = url.fileURLToPath(cureentImportMetaURL);
    const __dirname = path.dirname(__filename);

    return __dirname;
}