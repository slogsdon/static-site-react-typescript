import * as fs from "fs";
import * as React from "react";

export interface IInlineScriptProps {
  src: string;
}

export default ({ src }: IInlineScriptProps) => {
  const source = fs.readFileSync(
    `./_build/src/${src}.js`,
  );
  const html = { __html: source.toString() };
  return <script dangerouslySetInnerHTML={ html } />;
};
