import { transformAndPick, ignorePatternAndDir } from "./transformAndPick";

export function listAllNotes() {
  transformAndPick([ignorePatternAndDir()]);
}
