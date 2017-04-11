import * as fs from "fs";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { log } from "../settings";

export function renderComponentToFile(element: React.ReactElement<any>, path: string) {
  const html = renderToStaticMarkup(element);
  const dir = `./dist/${path}`;
  path = `${mkdirp(dir)}index.html`;
  fs.writeFileSync(path, html);

  if (log) {
    console.log(`'${path}' written.`);
  }
}

function mkdirp(directory: string) {
  return directory
    .split("/")
    .reduce((path, folder) => {
      path += folder + "/";
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      return path;
    }, "");
}
