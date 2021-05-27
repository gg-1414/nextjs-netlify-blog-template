import React from "react";
import { getTag } from "../lib/tags";
import Date from "./Date";
import Layout from "./Layout";
import BasicMeta from "./meta/BasicMeta";
import TagButton from "./TagButton";

type Props = {
  slug: string;
  tags: string[];
  heroImgDt: string;
  heroImgMb: string;
  date: Date;
  heading: string;
  byline: string;
  children: React.ReactNode;
}

export default function BlogBasicLayout({
  slug,
  tags,
  heroImgDt,
  heroImgMb,
  date,
  heading,
  byline,
  children,
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
          <header>
            <img src={heroImgMb} />
            <img src={heroImgDt} />
            <ul className={"tag-list"}>
              {tags.map((it, i) => (
                <li key={i}>
                  <TagButton tag={getTag(it)} />
                </li>
              ))}
            </ul>
            <div className={"metadata"}>
              <div>
                <Date date={date}/>
              </div>
            </div>
            <h2>{heading}</h2>
            <div>
              {byline}
            </div>
          </header>
          <div>
            {children}
          </div>
        </article>
      </div>
      <style jsx>
        {`
          .container {
            display: block;
            max-width: 36rem;
            width: 100%;
            margin: 0 auto;
            box-sizing: border-box;
            z-index: 0;
          }
          article {
            flex: 1 0 auto;
          }
          img {
            width: 100%;
          }
          h1 {
            margin: 0 0 0 0.5rem;
            font-size: 2.25rem;
          }
          .tag-list {
            list-style: none;
            text-align: right;
            margin: 1.75rem 0 0 0;
            padding: 0;
          }
          .tag-list li {
            display: inline-block;
            margin-left: 0.5rem;
          }

          @media (min-width: 769px) {
            .container {
              display: flex;
              flex-direction: column;
            }
          }
        `}
      </style>
    </Layout>
  )
}