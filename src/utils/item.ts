import * as fs from "fs-extra";
import * as klaw from "klaw";
import * as internal from "stream";
import { ignorePattern, repoPath } from "./config";

export class Item implements klaw.Item {
  path: string;
  stats: fs.Stats;
  constructor(k: klaw.Item) {
    this.path = k.path;
    this.stats = k.stats;
  }
  relativePath() {
    return removePrefix(this.path, repoPath());
  }
}

function getItemsWithoutIgnore(
  filters: internal.Transform[]
): Promise<Array<Item>> {
  return new Promise((resolve, reject) => {
    let files: Item[] = [];

    let target = klaw(repoPath());

    for (var t of filters) {
      target = target.pipe(t);
    }

    target
      .on("data", (item) => files.push(new Item(item)))
      .on("error", reject)
      .on("end", () => {
        resolve(files);
      });
  });
}

export class Filter extends internal.Stream.Transform {
  constructor(test: (item: klaw.Item) => Boolean) {
    super({
      objectMode: true,
      transform: function (item, enc, next) {
        if (test(item)) {
          this.push(item);
        }
        next();
      },
    });
  }
}

function ignoreInConfig() {
  // TODO: bug on .test
  return new Filter((item) => !ignorePattern().test(item.path));
}

export function getItems(filters?: internal.Transform[]): Promise<Array<Item>> {
  const basic = ignoreInConfig();
  if (filters === undefined) {
    return getItemsWithoutIgnore([basic]);
  }
  return getItemsWithoutIgnore([basic, ...filters.slice()]);
}

function removePrefix(path: string, prefix: string) {
  return path.slice(prefix.length + 1, path.length);
}
