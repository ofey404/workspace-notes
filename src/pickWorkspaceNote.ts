import { quickPickRelativePath, showFile } from "./utils/interactions";
import { Filter, getMarkdown } from "./utils/item";
import { hasWorkspaceTag } from "./utils/tag";

async function collectWorkspaceNote() {
  const filter = new Filter((item) => {
    return !item.stats.isDirectory() && hasWorkspaceTag(item.path);
  });
  return getMarkdown([filter]);
}

export async function pickWorkspaceNote() {
  collectWorkspaceNote()
    .then(await quickPickRelativePath)
    .then(showFile);
}
