import * as React from "react";
import { IContent, IDataListProps } from "../../../lib/content";

function sortDescBy(prop: string) {
  return (a: IContent, b: IContent) => {
    if (a[prop] < b[prop]) {
      return 1;
    }

    if (a[prop] > b[prop]) {
      return -1;
    }

    return 0;
  };
}

export default (props: IDataListProps) => (
  <main className="Posts">
    <h1>Posts</h1>
    {props.data && props.data
      .sort(sortDescBy("date"))
      .map((p: IContent, i: number) => (
        <div key={i}><a href={`/${p.slug}/`}>{p.title}</a></div>
      ))}
  </main>
);
