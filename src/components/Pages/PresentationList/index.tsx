import * as React from "react";
import { IContent, IDataListProps } from "../../../lib/content";

export default (props: IDataListProps) => (
  <main className="Presentations">
    <h1>Presentations</h1>
    {props.data && props.data
      .map((p: IContent, i: number) => (
        <div key={i}>{p.title}</div>
      ))}
  </main>
);
