import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

const blogsBasicDir = path.join(process.cwd(), "content/blogs/basic");
const blogsFullDir = path.join(process.cwd(), "content/blogs/full");

export type BlogContent = {
  readonly date: string;
  readonly color: string;
  readonly hero_img_dt: string;
  readonly hero_img_tb: string;
  readonly hero_img_mb: string;
  readonly tags?: string[];
  readonly heading: string;
  readonly byline: string;
  readonly body_list: string[];
  readonly fullPath: string;
  readonly slug: string;
}

let blogCache: BlogContent[];

export function fetchBlogContent(): BlogContent[] {
  if (blogCache) {
    console.log('blogCache?', blogCache);
    return blogCache;
  }

  // Get file names under /blogs
  const fileNames = fs.readdirSync(blogsBasicDir);
  // const fileNames = fs.readdirSync(blogsFullDir);
  // const fileNames = [...fs.readdirSync(blogsBasicDir), ...fs.readdirSync(blogsFullDir)]
  // console.log('fileNames',fileNames)
  const allBlogsData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(blogsBasicDir, fileName);
      const slug = fileName.replace(/\.mdx$/, "");
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // console.log('fileContents',fileContents)
      // Use gray-matter to parse the blog metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
      });
      const matterData = matterResult.data as {
        date: string;
        color: string;
        hero_img_dt: string;
        hero_img_tb: string;
        hero_img_mb: string;
        tags: string[];
        heading: string;
        byline: string;
        body_list: string[];
        fullPath: string;
        slug: string;
      };
      matterData.fullPath = fullPath;
      matterData.slug = slug;

      return matterData;
    });

  // Sort blogs by date
  blogCache = allBlogsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  return blogCache;
}

export function countBlogs(tag?: string): number {
  return fetchBlogContent().filter(
    (it) => !tag || (it.tags && it.tags.includes(tag))
  ).length;
}

export function listBlogContent(
  page: number,
  limit: number,
  tag?: string,
): BlogContent[] {
  return fetchBlogContent()
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit)
}
