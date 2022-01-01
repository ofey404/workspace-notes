import { Stream } from "stream";
import { transformAndPick, ignorePatternAndDir, isMarkDown } from "./transformAndPick";
import { hasWorkspaceTag } from "./util";

export function pickWorkspaceNote() {
  const hasCurrentWorkspaceTag = new Stream.Transform({
    objectMode: true,
    transform: function (item, enc, next) {
      if (hasWorkspaceTag(item.path)) {
        this.push(item);
      }
      next();
    },
  });
  transformAndPick([ignorePatternAndDir(), isMarkDown(), hasCurrentWorkspaceTag]);
}
