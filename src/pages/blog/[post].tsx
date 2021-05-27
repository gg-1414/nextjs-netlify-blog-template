import { GetStaticProps, GetStaticPaths } from "next";
import hydrate from "next-mdx-remote/hydrate";
import { MdxRemote } from "next-mdx-remote/types";
import matter from "gray-matter";
import fs from "fs";
import yaml from "js-yaml";
import { parseISO } from 'date-fns';
import { fetchBlogContent } from "../../lib/blog";
import BlogBasicLayout from "../../components/BlogBasicLayout";
import renderToString from "next-mdx-remote/render-to-string";

export type Props = {
  slug: string;
  tags: string[];
  heroImgDtSrc: string;
  heroImgMbSrc: string;
  dateString: string;
  heading: string;
  byline: string;
  source: MdxRemote.Source;
}

const slugToPostContent = (postContents => {
  let hash = {}
  postContents.forEach(it => hash[it.slug] = it)
  return hash;
})(fetchBlogContent());

export default function Post({
  slug,
  tags,
  heroImgDtSrc,
  heroImgMbSrc,
  dateString,
  heading,
  byline,
  source
}: Props) {
  const content = hydrate(source)
  console.log('content', content)
  return (
    <BlogBasicLayout
      slug={slug}
      tags={tags}
      heroImgDt={heroImgDtSrc}
      heroImgMb={heroImgMbSrc}
      date={parseISO(dateString)}
      heading={heading}
      byline={byline}
    >
      {content}
    </BlogBasicLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchBlogContent().map(it => "/blog/" + it.slug);
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.post as string;
  console.log('slug',slug)
  const source = fs.readFileSync(slugToPostContent[slug].fullPath, "utf8");
  console.log('source', source)
  const { content, data } = matter(source, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object }
  });
  console.log('data', data)
  const mdxSource = await renderToString(content)
  return {
    props: {
      slug: slug,
      tags: data.tags,
      heroImgDtSrc: data.hero_img_dt,
      heroImgMbSrc: data.hero_img_mb,
      dateString: data.date,
      heading: data.heading,
      byline: data.byline,
      source: mdxSource
    }
  }
}
