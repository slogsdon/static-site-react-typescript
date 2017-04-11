import * as React from "react";
import RawHtml from "../RawHtml";

function postTags(tags: any) {
  return (
    <p className="meta tags">
      <span className="label">tags:</span>
      {tags.map((tag: any, i: number) => (
        <a key={ i } href="{ url_for(tag.path) }" className="ml3 black-70">{ tag.name }</a>
      ))}
    </p>
  );
}

export default (props: any) => (
  <article className="post" itemScope itemType="http://schema.org/BlogPosting">
    <header className="header">
      <meta itemScope itemProp="mainEntityOfPage"  itemType="https://schema.org/WebPage" itemID="{ props.post.permalink }" />
      <h1 className="title lh-title f2 mt4 mb1 f1-l measure-wide" itemProp="name headline">{ props.post.title }</h1>
      <div className="meta">
        <time dateTime="{ date_xml(props.post.date) }"
              itemProp="datePublished" className="f6 black-50">
          Published: { props.post.date.toString() }
        </time>
        <time dateTime="{ date_xml(props.post.updated) }"
              itemProp="dateModified" className="f6 black-50">
          modified date if present
        </time>
        <span className="author meta"></span>
      </div>
    </header>

    <RawHtml className="content lh-copy" itemProp="articleBody">
      { props.post.body }
    </RawHtml>

    <footer className="post-footer mt4 bt bb b--black-10">
      { props.post.tags && postTags(props.post.tags) }
    </footer>
  </article>
);
