import { Parser } from "tar";

type ProcessFile = ({
  filename,
  content,
}: {
  filename: string;
  content: string;
}) => Promise<void>;

/**
 * Matches the markdown files under one folder of the repository. Every archive entry sits
 * under a "<repo>-<ref>/" root folder, i.e. "docs-main/flow/index.md".
 */
export function markdownPattern(pathToDocs: string) {
  return new RegExp(`^[^/]+/${pathToDocs}/.+\\.md$`);
}

export function createTarFileProcessor(
  stream: NodeJS.ReadableStream,
  pattern: RegExp,
) {
  return (processFile: ProcessFile) =>
    processFilesFromRepoTarball(stream, pattern, processFile);
}

async function processFilesFromRepoTarball(
  stream: NodeJS.ReadableStream,
  pattern: RegExp,
  processFile: ProcessFile,
): Promise<void> {
  let processing: Promise<void>[] = [];
  await new Promise<void>((accept, reject) => {
    // The parser gunzips, and skips every entry the filter turns down.
    let parser = new Parser({
      strict: true,
      filter: (entryPath) => pattern.test(entryPath),
      onReadEntry: (entry) => {
        // remove "docs-main" or "docs-flow-4.0.0" from the full name
        let filename = removeRepoRefName(entry.path);
        processing.push(
          entry
            .concat()
            .then((content) => processFile({ filename, content: content.toString() })),
        );
      },
    });
    parser.on("error", reject);
    parser.on("end", accept);
    stream.on("error", reject);
    stream.pipe(parser);
  });
  await Promise.all(processing);
}

function removeRepoRefName(headerName: string): string {
  return headerName.replace(/^.+?[/]/, "");
}
