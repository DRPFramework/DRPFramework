import * as alt from 'alt-server';
import * as DRP from '../Main';
import * as fs from 'fs';
import * as path from 'path';

type GroupType = {
  [key: string]: IGroup;
};

export class GroupManager {
  public groups: Map<String, Group> = new Map<String, Group>();

  public loadGroups(): void {
    let groupPath = path.join(DRP.configDir, 'groups.json');
    let groupData: GroupType = JSON.parse(fs.readFileSync(groupPath, 'utf-8'));
    for (let groupKey in groupData) {
      let groupJsonData = groupData[groupKey];
      this.groups.set(groupKey, new Group(groupJsonData.name, groupJsonData.permissions, groupJsonData.default));
    }
  }

  public getGroup(player: alt.Player): Group | null {
    return this.groups.get(player.getSyncedMeta('Group'));
  }

  public hasPerm(player: alt.Player, permission: String): boolean {
    const group = this.getGroup(player);
    if (group == null) return false;
    return group.permissions.some((cPermission) => cPermission === permission);
  }

  public getDefaultGroup(): [String, Group] {
    return Array.from(this.groups).find((data) => data[1].default);
  }
}

export interface IGroup {
  readonly name: string;
  readonly default?: boolean;
  readonly permissions: string[];
}

export class Group {
  public readonly name: string;
  public readonly default?: boolean = false;
  public readonly permissions: string[];

  constructor(name: string, permissions: string[], def: boolean = false) {
    this.name = name;
    this.default = def;
    this.permissions = permissions;
  }

  public getName(): string {
    return this.name;
  }

  public isDefault(): boolean {
    return this.default;
  }

  public getPermissions(): string[] {
    return this.permissions;
  }
}
