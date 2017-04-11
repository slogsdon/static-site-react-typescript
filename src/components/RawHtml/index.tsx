import * as React from "react";

function getMarkup(props: any) {
  return { __html: props.children };
}

export default (props: any) => (
  <section className={props.className} dangerouslySetInnerHTML={ getMarkup(props) } />
);
