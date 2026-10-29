/*!
 * Adapted from https://github.com/remix/remix-website
 * 
 * Uses unified, remark, and rehype to process markdown content.
 */
import parseFrontMatter from "gray-matter";
import themeJson from "~/styles/base16.json";
import { transformerCopyButton } from '@rehype-pretty/transformers';

let processor: Awaited<ReturnType<typeof getProcessor>>;
export async function processMarkdown(content: string) {
  processor = processor || (await getProcessor());
  let { data: attributes, content: raw } = parseFrontMatter(content);
  let vfile = await processor.process(raw);
  let html = vfile.value.toString();
  return { attributes, raw, html };
}

export async function getProcessor() {
  let [
    { unified },
    { default: remarkGfm },
    { default: remarkParse },
    { default: remarkRehype },
    { default: rehypeSlug },
    { default: rehypeStringify },
    { default: rehypeAutolinkHeadings },
    { default: rehypePrettyCode },
  ] = await Promise.all([
    import("unified"),
    import("remark-gfm"),
    import("remark-parse"),
    import("remark-rehype"),
    import("rehype-slug"),
    import("rehype-stringify"),
    import("rehype-autolink-headings"),
    import("rehype-pretty-code"),
  ]);

  // The theme actually stores #FFFF${base-16-color-id} because vscode-textmate
  // requires colors to be valid hex codes, if they aren't, it changes them to a
  // default, so this is a mega hack to trick it.
  const themeString = JSON.stringify(themeJson).replace(/#FFFF(.{2})/g, "var(--base$1)");

  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypePrettyCode, {
      keepBackground: false,
      theme: JSON.parse(themeString),
      // Needed if the documentation you are using has different meta strings
      // TODO: turn this into optional externalised 
      // filterMetaString: (str) => str.replace(/lines=\[([^]*)\]/g, '{$1}').replace(/filename=([^ ]*)/g, 'title="$1"'),
      transformers: [
        transformerCopyButton({
          visibility: 'always',
          feedbackDuration: 3_000,
          copyIcon: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='rgb(9, 9, 11)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'%3E%3Crect width='13' height='13' x='9' y='9' rx='2' ry='2' vector-effect='non-scaling-stroke'/%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E",
          successIcon: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='rgb(9, 9, 11)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'%3E%3Cpath d='M20 6 9 17l-5-5' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E",
        }),
      ],
    });
}
