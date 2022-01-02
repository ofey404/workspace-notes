import { hasWorkspaceTag } from "./util";
import {
  transformAndPick,
  ignorePatternAndDir,
  isMarkDown,
  newTransform,
} from "./transformAndPick";

export function pickWorkspaceNote() {
  const hasCurrentWorkspaceTag = newTransform((item) => {
    return hasWorkspaceTag(item.path);
  });
  transformAndPick([
    ignorePatternAndDir(),
    isMarkDown(),
    hasCurrentWorkspaceTag,
  ]);
}
