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
  bodyList: string[];
  sources: MdxRemote.Source[];
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
  bodyList,
  sources,
}: Props) {
  const content = sources.map((it) => hydrate(it));
  
  return (
    <BlogBasicLayout
      slug={slug}
      tags={tags}
      heroImgDt={heroImgDtSrc}
      heroImgMb={heroImgMbSrc}
      date={parseISO(dateString)}
      heading={heading}
      byline={byline}
      bodyList={bodyList}
    >
      <div className="body-list">
        {content}
      </div>
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
  const source = fs.readFileSync(slugToPostContent[slug].fullPath, "utf8");

  const { data } = matter(source, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object }
  });

  const mdxSourcePromises = data.body_list.map(async (bod: string) => {
    return await renderToString(bod);
  })
  const mdxSourcesResult = await Promise.all(mdxSourcePromises);

  return {
    props: {
      slug: slug,
      tags: data.tags,
      heroImgDtSrc: data.hero_img_dt,
      heroImgMbSrc: data.hero_img_mb,
      dateString: data.date,
      heading: data.heading,
      byline: data.byline,
      bodyList: data.body_list,
      sources: mdxSourcesResult,
    }
  }
}
