import * as React from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import { getContent, IContent } from "./content";

export function addDataToComponent(content: IContent, data: IContent[]) {
  if (!content.component) {
    return content;
  }

  const filtered = data.filter((p) => p.type === content.slug);
  content.component = React.cloneElement(content.component, { data: filtered });
  return content;
}

export function build() {
  return getContent();
}

export function componentize(content: IContent) {
  switch (content.type) {
    case "posts":
    case "drafts":
      content.component = React.createElement(Post, { post: content });
      break;
    default:
      break;
  }

  if (content.component) {
    content.component = React.createElement(
      Layout,
      { title: content.title },
      content.component,
    );
  }

  return content;
}

export function createPageContent(component: (...args: any[]) => React.ReactElement<any>, slug: string): IContent {
  const element = React.createElement(component);
  return {
    component: element,
    slug,
    type: "pages",
  };
}
