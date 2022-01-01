import { Stream } from "stream";
import { transFormAndPick, ignorePatternAndDir, isMarkDown } from "./transformAndPick";
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
  transFormAndPick([ignorePatternAndDir(), isMarkDown(), hasCurrentWorkspaceTag]);
}
