import { GetStaticProps } from "next";
import Layout from "../../components/Layout";
import { BlogContent, countBlogs, listBlogContent } from "../../lib/blog-full";
import BasicMeta from "../../components/meta/BasicMeta";
import OpenGraphMeta from "../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../components/meta/TwitterCardMeta";
import config from "../../lib/config";
import BlogList from "../../components/BlogList";

type Props = {
  blogs: BlogContent[];
  pagination: {
    current: number;
    pages: number;
  }
}

export default function Index({blogs, pagination}: Props) {
  const url = "/blogs-full";
  const title = "All blog full posts";
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      {/* <BlogList blogs={blogs} pagination={pagination} /> */}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const blogs = listBlogContent(1, config.posts_per_page);
  console.log('blogs', blogs)
  const pagination = {
    current: 1,
    pages: Math.ceil(countBlogs() / config.posts_per_page),
  };
  return {
    props: {
      blogs,
      pagination
    }
  }
};