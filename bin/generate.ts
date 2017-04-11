import { addDataToComponent, build, componentize } from "../src/lib/build-util";
import { IContent } from "../src/lib/content";
import { renderComponentToFile } from "../src/lib/render-component-to-file";
import pages from "../src/pages";
import { drafts } from "../src/settings";

build()
  .then((contents) => {
    contents
      .concat(pages)
      .map((content: IContent) => {
        if (!drafts && content.type === "drafts") {
          return;
        }

        if (content.type === "pages" && content.component) {
          content = addDataToComponent(content, contents);
        }

        content = componentize(content);
        if (content.component && content.slug !== undefined) {
          renderComponentToFile(content.component, content.slug);
        }
      });
  })
  .catch((err) => console.log(err));
