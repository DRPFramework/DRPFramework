import * as alt from 'alt-server';

import * as path from 'path';

import { BanManager } from "./general/BanManager";

const mainDir = alt.getResourcePath('drp');
const configDir = path.join(mainDir, 'config');

const banManager: BanManager = new BanManager();

export { mainDir, configDir, banManager };
