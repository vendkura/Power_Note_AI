import rehypeAutolinkHeading from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const rehypePlugins = [
  [
    rehypePrism,
    {
      ignoreMissing: true,
    },
  ],
  rehypeSlug,
  rehypeAutolinkHeading,
];

export const remarkPlugins = [remarkGfm];
