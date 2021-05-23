import React from "react";
import { getTag } from "../lib/tags";
import Date from "./Date";
import Layout from "./Layout";
import BasicMeta from "./meta/BasicMeta";

type Props = {
  slug: string;
  tags: string[];
  date: Date;
  heading: string;
}

export default function BlogBasicLayout({
  slug,
  tags,
  date,
  heading,
}: Props) {
  const keywords = tags.map(it => getTag(it).name);
  return (
    <Layout>
      <BasicMeta
        url={`/blog/${slug}`}
        title={heading}
        keywords={keywords}
      />
      <div className={"container"}>
        <article>
          <header>{heading}</header>
          <div className={"metadata"}>
            <div>
              <Date date={date}/>
            </div>
            <div>
              {/* {byline} */}
            </div>
          </div>
        </article>
      </div>
    </Layout>
  )
}