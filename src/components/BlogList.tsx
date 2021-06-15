import React from "react";
import { BlogContent } from "../lib/blog"
import BlogItem from "./BlogItem";

type Props = {
  blogs: BlogContent[];
  pagination: {
    current: number;
    pages: number;
  }
};

export default function BlogList({ blogs, pagination }: Props) {
  return (
    <div className={"container"}>
      <div className={"blog"}>
        <ul className={"blog-list"}>
          {blogs.map((it, i) => (
            <li key={i}>
              <BlogItem blog={it} />
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          margin: 0 auto;
          max-width: 1200px;
          width: 100%;
          padding: 0 1.5rem;
        }
        ul {
          margin: 0;
          padding: 0;
        }
        li {
          list-style: none;
        }
        .posts {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
        }
        .posts li {
          margin-bottom: 1.5rem;
        }
        .post-list {
          flex: 1 0 auto;
        }
        .categories {
          display: none;
        }
        .categories li {
          margin-bottom: 0.75em;
        }

        @media (min-width: 769px) {
          .categories {
            display: block;
          }
        }
      `}</style>
    </div>
  )
}

