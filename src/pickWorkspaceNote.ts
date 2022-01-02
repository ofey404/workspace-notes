import { Stream } from "stream";
import { hasWorkspaceTag } from "./util";
import { transformAndPick, ignorePatternAndDir, isMarkDown } from "./transformAndPick";

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
