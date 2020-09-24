import * as alt from 'alt-server';

import * as path from 'path';

const mainDir = alt.getResourcePath('drp');
const configDir = path.join(mainDir, 'config');

export {
    mainDir,
    configDir
};
