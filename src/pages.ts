import {
  About,
  Index,
  PostList,
  PresentationList,
} from "./components/Pages";
import { createPageContent } from "./lib/build-util";
import { IContent } from "./lib/content";

const pages: IContent[] = [
  createPageContent(Index, ""),
  createPageContent(About, "about"),
  createPageContent(PostList, "posts"),
  createPageContent(PresentationList, "presentations"),
];
export default pages;
