import React from "react";
import { getTag } from "../lib/tags";
import Date from "./Date";
import Layout from "./Layout";
import BasicMeta from "./meta/BasicMeta";
import TagButton from "./TagButton";

type Props = {
  slug: string;
  tags: string[];
  bgColor: string;
  heroImgDt: string;
  heroImgTb: string;
  heroImgMb: string;
  date: Date;
  heading: string;
  byline: string;
  children: React.ReactNode;
}

function addNbsp(str: string) {
  const arr = str.split(" ");
  arr.splice(-1, 0, '&nbsp;');
  const newArr = arr.slice(0, -3);
  newArr.push(arr.slice(-3, arr.length).join(""));
  return {__html: `${newArr.join(" ")}`};
}

export default function BlogBasicLayout({
  slug,
  tags,
  bgColor,
  heroImgDt,
  // heroImgTb,
  heroImgMb,
  // date,
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
      <article>
        <section className="hero-img">
          <picture className="mobile-only">
            <img src={heroImgMb} />
          </picture>
          <picture className="desktop-only">
            <img src={heroImgDt} />
          </picture>
        </section>

        <section className="content" style={{background: bgColor}}>
          <ul className={"tag-list"}>
            {tags.map((it, i) => (
              <li key={i}>
                <TagButton tag={getTag(it)} />
              </li>
            ))}
          </ul>

          {/* <div className={"metadata"}>
            <div>
              <Date date={date}/>
            </div>
          </div> */}

          <h2>{heading}</h2>
          <p className="byline" dangerouslySetInnerHTML={addNbsp(byline)}/>
          <div className="body">{children}</div>
        </section>
      </article>
      <style jsx>
        {`
          .content {
            padding: 20px;
          }
          img {
            width: 100%;
            max-height: 569px;
            object-fit: cover;
          }
          h2 {
            line-height: 1;
            text-align: center;
            font-size: 39px;
            font-family: "Queens";
            font-weight: 100;
          }
          .byline {
            font-size: 20px;
            font-weight: 500;
            text-align: center;
            text-transform: uppercase;
          }
          .tag-list {
            list-style: none;
            padding: 0;
            display: flex;
            justify-content: center;
          }
          .tag-list li {
            display: inline-block;
            margin-left: 16px;
          }
          .tag-list li:first-child {
            margin-left: 0;
          }

          @media (max-width: 768px) {
            .desktop-only {
              display: none;
            }
          }

          @media (min-width: 769px) {
            .mobile-only {
              display: none;
            }
            img {
              max-height: 771px;
            }
            .tag-list a {
              font-size: 24px;
            }
            h2 {
              font-size: 130px;
            }
            .byline {
              font-size: 30px;
            }
          }
        `}
      </style>
    </Layout>
  )
}