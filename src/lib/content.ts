const fm = require("front-matter");
import * as fs from "fs";
import * as hljs from "highlight.js";
import * as marked from "marked";
import * as path from "path";
import * as React from "react";
const walk = require("walk");

export const REGEX_POST_FILENAME = /(\d{4})\-(\d{2})\-(\d{2})-(.*)/;

export interface IAttributes {
  [key: string]: any;
}
export interface IContent {
  attributes?: IAttributes;
  body?: string;
  component?: React.ReactElement<any>;
  date?: Date;
  file?: string;
  frontmatter?: string;
  slug?: string;
  type?: string;
  [key: string]: any;
}

export interface IDataListProps {
  data?: IContent[];
}

function updatePostFileName(post: IContent, file: string) {
  file = path.relative(path.resolve("./content"), file);
  post.file = file;
  return post;
}

function updatePostType(post: IContent) {
  if (!post.file) {
    return post;
  }
  const type =
    post.file
    .split("/")
    .slice(0, 1)
    .join();
  post.type = type;
  return post;
}

function updatePostSlug(post: IContent) {
  const slug = post.file &&
    post.file
      .split(".")
      .slice(0, -1)
      .join();
  post.slug = slug;
  return post;
}

export function getContent(contentCallback?: (post: IContent) => void): Promise<IContent[]> {
  return new Promise((resolve) => {
    const contents: IContent[] = [];
    walk.walk("./content")
    .on("file", (root: any, stat: any, next: () => void) => {
      const file = `${root}/${stat.name}`;
      fs.readFile(file, "utf8", (err, content) => {
        if (err) {
          return;
        }

        let post = fm(content);
        post = updatePostFileName(post, file);
        post = updatePostType(post);
        post = updatePostSlug(post);
        post = updatePostObject(post);

        contents.push(post);
        if (contentCallback) {
          contentCallback(post);
        }
      });
      next();
    })
    .on("errors", (_root: any, _stat: any, next: () => void) => {
      next();
    })
    .on("end", () => resolve(contents));
  });
}

export function markdown(content: string | undefined): string {
  marked.setOptions({
    gfm: true,
    highlight: (code: string, lang: string) => hljs.highlightAuto(code, [lang]).value,
    langPrefix: "hljs language-",
  });
  return marked(content || "");
}

export function updatePostObject(post: IContent) {
  if (post.slug) {
    const matches =
      REGEX_POST_FILENAME.test(post.slug) &&
      REGEX_POST_FILENAME.exec(post.slug);
    const parts = post.slug.split("/").filter((p) => !!p);

    if (matches) {
      const year = parseInt(matches[1], 10);
      const month = parseInt(matches[2], 10) - 1;
      const day = parseInt(matches[3], 10);
      parts[parts.length - 1] = matches[4];
      post.date = post.date || new Date(year, month, day);
    }

    post.slug = parts.join("/");
  }

  if (post.attributes) {
    for (const prop in post.attributes) {
      if (post.attributes.hasOwnProperty(prop)) {
        post[prop] = post.attributes[prop];
      }
    }
  }

  delete post.attributes;
  delete post.frontmatter;
  post.body = markdown(post.body);
  return post;
}
