# Genkit JS Setup

Follow these instructions to set up Genkit in the current codebase. These instructions are general-purpose and have not been written with specific codebase knowledge, so use your best judgement when following them.

0. Tell the user "I'm going to check out your workspace and set you up to use Genkit for GenAI workflows."
1. Set up only what the user requested. Create a specific flow when it is part of the request; setup alone does not require an example flow.
2. Check to see if any Genkit provider plugin (such as `@genkit-ai/google-genai` or `@genkit-ai/oai-compat` or others, may start with `genkitx-*`) is installed.
   - Use the user-specified provider, otherwise preserve existing provider configuration, otherwise default to Google AI. Ask only if conflicting requirements leave the choice unresolved.
   - **For non-Google providers**: Use `genkit docs:search "plugins"` to find the correct package and installation instructions.
   - If this is a Next.js app, install `@genkit-ai/next` as well.
3. Search the codebase for the exact string `genkit(` (remember to escape regexes properly) which would indicate that the user has already set up Genkit in the codebase. If found, reuse the configuration and skip redundant setup. Continue any requested flow implementation using that configuration.
4. Create an `ai` directory in the primary source directory of the project (this may be e.g. `src` but is project-dependent). Adapt this path if your project uses a different structure.
5. Create `{sourceDir}/ai/genkit.ts` and populate it using the example below. DO NOT add a `next` plugin to the file, ONLY add a model provider plugin to the plugins array:

```ts
import { genkit, z } from 'genkit';
// Import your chosen provider plugin here. Example:
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(), // Add your provider plugin here
  ],
  model: googleAI.model('gemini-2.5-flash'), // Set your provider's model here
});

export { z };
```

6. Create `{sourceDir}/ai/tools` and `{sourceDir}/ai/flows` directories, but leave them empty for now.
7. Create `{sourceDir}/ai/index.ts` and populate it with the following (change the import to match import aliases in `tsconfig.json` as needed):

```ts
import './genkit.js';
// import each created flow, tool, etc. here for use in the Genkit Dev UI
```

8. Add a `genkit:ui` script to `package.json` that runs `genkit start -- npx tsx --watch {sourceDir}/ai/index.ts` (or `npx genkit-cli` or `pnpm dlx` or `yarn dlx` for those package managers, if CLI is not locally installed). DO NOT try to run the script now.
9. Tell the user "Genkit is now configured and ready for use." as setup is now complete. Also remind them to set appropriate env variables (e.g. `GEMINI_API_KEY` for Google providers). If flow implementation was also requested, continue with it. Otherwise finish setup without adding unsolicited flows or asking for the same instruction again.

## Next Steps & Troubleshooting

- **Documentation**: Use the [CLI](docs-and-cli.md) to access documentation (e.g., `genkit docs:search`).
- **Building Flows**: See [examples.md](examples.md) for patterns on creating flows, adding tools, and advanced configuration.
- **Troubleshooting**: If you encounter issues during setup or initialization, check [common-errors.md](common-errors.md) for solutions.
