import * as React from "react";
import Footer from "../Footer";

export default () => (
  <div className="f6 b--black-10 bn-l bt dib-ns fl-l header lh-copy ml3-l mt1-l mt3 tc v-top-ns w-100 w-20-l">
    <header>
      <div className="mv4 mv5-l">
        <a className="black-70 b f3-l f4" href="/" title="Home" id="menu">
          Shane Logsdon
          <div>
            <small className="f6 normal">Polyglot Developer</small>
          </div>
        </a>
      </div>
      <nav className="mv4 mv5-l b--black-10 bb bt page-nav">
        <ul className="list pl1">
          <li className="di">
            <a className="black-70 mr3 page-link" href="/">Home</a>
          </li>
          <li className="di">
            <a className="black-70 mr3 page-link" href="/posts/">Posts</a>
          </li>
          <li className="di">
            <a className="black-70 mr3 page-link" href="/projects/">Projects</a>
          </li>
          <li className="di">
            <a className="black-70 mr3 page-link" href="/presentations/">Presentations</a>
          </li>
          <li className="di">
            <a className="black-70 mr3 page-link" href="/about/">About</a>
          </li>
        </ul>
      </nav>
      <p className="mv4-l description ma3">I develop things. Sometimes, I write about them here. Let's build something together.</p>
      <nav className="mv3 interaction-nav pb3">
        <ul className="list contact-list tl">
          <li className="mv1">
            Email me:&nbsp;
            <a className="black-70" href="mailto:shane@logsdon.io" rel="noopener" target="_blank">
              shane@logsdon.io
            </a>
          </li>
          <li className="mv1">
            Develop with me:&nbsp;
            <a className="black-70" href="https://github.com/slogsdon" rel="noopener" target="_blank" title="GitHub">
              slogsdon
            </a>
          </li>
          <li className="mv1">
            Tweet me:&nbsp;
            <a className="black-70" href="https://twitter.com/shanelogsdon" rel="noopener" target="_blank" title="Twitter">
              shanelogsdon
            </a>
          </li>
        </ul>
      </nav>
      <nav className="mv3 mv4-l tag-nav">Tags
        <ul className="list tag-list tj">
          <li className="dib ma1">
            <a className="black-70" href="/tag/net/">.net</a>
          </li>
        </ul>
      </nav>
    </header>
    <Footer className="db dn-l" />
  </div>
);
