import * as fs from "fs-extra";
import * as matter from "gray-matter";
import { repoPath } from "./config";

function pushTagIfNo(
  obj: matter.GrayMatterFile<matter.Input>,
  tag: string,
  val: string
) {
  if (tag in obj.data) {
    if (obj.data[tag] instanceof Array) {
      if (!obj.data[tag].includes(val)) {
        obj.data[tag].push(val);
      }
    } else {
      if (val !== obj.data[tag]) {
        obj.data[tag] = [obj.data[tag], val];
      }
    }
  } else {
    obj.data[tag] = val;
  }
}

export async function addWorkspaceTagIfNo(filePath: string) {
  let obj = matter(await fs.readFile(filePath, "utf-8"));
  let workspacePath = repoPath();
  if (workspacePath === undefined) {
    return;
  }
  pushTagIfNo(obj, "workspace", workspacePath);
  await fs.outputFile(filePath, matter.stringify(obj.content, obj.data));
}

function hasTag(obj: matter.GrayMatterFile<matter.Input>, tag: string) {
  if (obj.data[tag] !== undefined) {
    return true;
  }
  return false;
}
