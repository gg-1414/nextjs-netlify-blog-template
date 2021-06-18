import { BlogContent } from "../lib/blog";
import Date from "./Date";
import Link from "next/link";
import { parseISO } from "date-fns";

type Props = {
  blog: BlogContent;
};

export default function BlogItem({ blog }: Props) {
  console.log('blog.slug', blog.slug)
  return (
    <Link href={"/blog/" + blog.slug}>
      <a>
        <Date date={parseISO(blog.date)} />
        <h2>{blog.heading}</h2>
        <style jsx>
          {`
            a {
              color: #222;
              display: inline-block;
            }
            h2 {
              margin: 0;
              font-weight: 500;
            }
          `}
        </style>
      </a>
    </Link>
  );
}
