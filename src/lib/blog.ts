import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

const blogsDirectory = path.join(process.cwd(), "content/blogs");

export type BlogContent = {
  readonly date: string;
  readonly hero: string;
  readonly tags?: string[];
  readonly heading: string;
  readonly byline: string;
  readonly body: string;
  readonly fullPath: string;
  readonly slug: string;
}

let blogCache: BlogContent[];

export function fetchBlogContent(): BlogContent[] {
  if (blogCache) {
    return blogCache;
  }
  // Get file names under /blogs
  const fileNames = fs.readdirSync(blogsDirectory);
  const allBlogsData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(blogsDirectory, fileName);
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
        hero: string;
        tags: string[];
        heading: string;
        byline: string;
        body: string;
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
