import { z } from "zod";

export const envSchema = z
  .object({
    // A token to increase the rate limiting from 60/hr to 1000/hr
    GITHUB_TOKEN: z.string().optional(),

    // GitHub repo to pull docs from
    SOURCE_REPO: z.string(),

    // For development, reading the docs from a local repo
    LOCAL_REPO_RELATIVE_PATH: z.string().optional(),

    // true/1/yes/on turns the in-memory caches off; unset, false/0/no/off leave them on.
    NO_CACHE: z.stringbool().default(false),
  })
  .superRefine((env, ctx) => {
    let required = {
      production: "GITHUB_TOKEN",
      development: "LOCAL_REPO_RELATIVE_PATH",
    } as const;
    let name = required[process.env.NODE_ENV as keyof typeof required];
    if (name && !env[name]) {
      ctx.addIssue({
        code: "custom",
        path: [name],
        message: "Missing required environment variable " + name,
      });
    }
  });

export const env = envSchema.parse(process.env);
