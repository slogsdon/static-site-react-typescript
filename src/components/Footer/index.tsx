import * as React from "react";

export interface IFooterProps {
  className?: string;
}

export default (props: IFooterProps) => (
  <footer className={`footer mv4 ${props.className}`}>
    <p className="dib mr3 copyright">
      <small>&copy; 2017 Shane Logsdon</small>
    </p>
    <p className="dib mr3 rss-subscribe">
      <small>subscribe <a className="black-70" href="/feed.xml">via RSS</a></small>
    </p>
    <p className="dib mr3 toggle-ligatures">
      <small><a className="black-70" href="javascript:toggleLigatures();">toggle code ligatures</a></small>
    </p>
  </footer>
);
