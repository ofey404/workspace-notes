import { quickPickRelativePath, showFile } from "./utils/interactions";
import { Filter, getMarkdown } from "./utils/item";

export async function listAllNotes() {
  getMarkdown()
    .then(await quickPickRelativePath)
    .then(await showFile);
}
