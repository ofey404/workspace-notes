import { quickPickRelativePath, showFile } from "./utils/interactions";
import { Filter, getMarkdown } from "./utils/item";

export async function listAllNotes() {
  getMarkdown([new Filter((item) => !item.stats.isDirectory())])
    .then(await quickPickRelativePath)
    .then(await showFile);
}
