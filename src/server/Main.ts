import * as alt from 'alt-server';

import * as path from 'path';

import { BanManager } from './general/BanManager';
import { GroupManager } from './general/GroupManager';

import './extensions/Player';

const mainDir = alt.getResourcePath('drp');
const configDir = path.join(mainDir, 'config');

const banManager: BanManager = new BanManager();
const groupManager: GroupManager = new GroupManager();

export { mainDir, configDir, banManager, groupManager };
