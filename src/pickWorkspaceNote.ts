import { quickPickRelativePath, showFile } from "./utils/interactions";
import { Filter, getItems } from "./utils/item";
import { hasWorkspaceTag } from "./utils/tag";

async function collectWorkspaceNote() {
  const filter = new Filter((item) => {
    return !item.stats.isDirectory() && hasWorkspaceTag(item.path);
  });
  return getItems([filter]);
}

export async function pickWorkspaceNote() {
  collectWorkspaceNote()
    .then(await quickPickRelativePath)
    .then(showFile);
}
