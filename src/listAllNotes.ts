import { quickPickRelativePath, showFile } from "./utils/interactions";
import { Filter, getItems } from "./utils/item";

export async function listAllNotes() {
  getItems([new Filter((item) => !item.stats.isDirectory())])
    .then(await quickPickRelativePath)
    .then(await showFile);
}
