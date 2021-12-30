import { transFormAndPick, ignorePatternAndDir } from "./transformAndPick";

export function listAllNotes() {
  transFormAndPick([ignorePatternAndDir()]);
}
