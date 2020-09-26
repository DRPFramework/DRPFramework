import * as alt from 'alt-server';
import * as DRP from '../Main';
import * as fs from 'fs';
import * as path from 'path';

type GroupType = {
  [key: string]: IGroup;
};

export class GroupManager {
  public groups: Map<string, Group> = new Map<string, Group>();

  public loadGroups(): void {
    let groupPath = path.join(DRP.configDir, 'groups.json');
    let groupData: GroupType = JSON.parse(fs.readFileSync(groupPath, 'utf-8'));
    for (let groupKey in groupData) {
      let groupJsonData = groupData[groupKey];
      this.groups.set(
        groupKey,
        new Group(groupJsonData.name, groupJsonData.permissions, groupJsonData.parents, groupJsonData.default)
      );
    }
  }

  public getGroup(player: alt.Player): Group | null {
    return this.groups.get(player.getSyncedMeta('Group'));
  }

  public hasPerm(player: alt.Player, permission: string, controlParent: boolean): boolean {
    const group = this.getGroup(player);
    if (group == null) return false;
    let permissionsCopy: string[] = [];
    if (controlParent) {
      for (let parentId in group.parents) {
        let parentName = group.parents[parentId];
        let parent = this.groups.get(parentName);
        if (parent == null) continue;
        permissionsCopy.push(...parent.permissions);
      }
    }
    permissionsCopy.push(...group.permissions);
    return permissionsCopy.some((cPermission) => cPermission === permission);
  }

  public getDefaultGroup(): [string, Group] {
    return this.groups == null || this.groups.size <= 0 ? [null, null] : Array.from(this.groups).find((data) => data[1].default);
  }
}

export interface IGroup {
  readonly name: string;
  readonly default?: boolean;
  readonly permissions: string[];
  readonly parents?: string[];
}

export class Group {
  public readonly name: string;
  public readonly default?: boolean = false;
  public readonly permissions: string[];
  public readonly parents?: string[] = [];

  constructor(name: string, permissions: string[], parents: string[] = [], def: boolean = false) {
    this.name = name;
    this.default = def;
    this.permissions = permissions;
    this.parents = parents;
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

  public getParents(): string[] {
    return this.parents;
  }
}
