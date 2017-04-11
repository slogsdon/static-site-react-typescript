import * as React from "react";
import Footer from "../Footer";
import InlineScript from "../InlineScript";
import Sidebar from "../Sidebar";

export default (props: any) => (
  <html lang="en">
    <head>
      <title>{ props.title }</title>
    </head>
    <body className="fira-code sans-serif">
      <div className="fl-l w-100 dib-l ml4-l sub-header w-50-l">
        <div className="w-100 b--black-10 tc ba dn-l">
          <a className="w-100 black-30 db pv2" href="#menu">menu</a>
        </div>

        <main className="content">
          { props.children }
          <InlineScript src="components/Layout/tachyonize-markdown" />
        </main>

        <Footer className="dn db-l" />
      </div>

      <Sidebar />
      <noscript id="deferred-styles">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/tachyons/4.7.0/tachyons.css" type="text/css" rel="stylesheet" />
      </noscript>
      <InlineScript src="components/Layout/load-delayed-styles" />
    </body>
  </html>
);
