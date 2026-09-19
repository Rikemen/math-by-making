---
name: developing-genkit-js
description: Develop or troubleshoot Genkit in Node.js/TypeScript when the user explicitly requests Genkit or the target code uses Genkit dependencies or APIs. General AI agents, flows, tools, and unrelated type or API errors do not activate this skill.
metadata:
  genkit-managed: true
---

# Genkit JS

## Prerequisites

When the requested operation needs the `genkit` CLI, ensure it is available. Explanations and source inspection can use the relevant references without installing the CLI. Reuse a known version check while the environment is unchanged.
-   Run `genkit --version` to verify. Minimum CLI version needed: **1.29.0**
-   If not found or if an older version (1.x < 1.29.0) is present, install/upgrade it: `npm install -g genkit-cli@^1.29.0`.

**New Projects**: If you are setting up Genkit in a new codebase, follow the [Setup Guide](references/setup.md).

## Hello World

```ts
import { z, genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
});

export const myFlow = ai.defineFlow({
  name: 'myFlow',
  inputSchema: z.string().default('AI'),
  outputSchema: z.string(),
}, async (subject) => {
  const response = await ai.generate({
    model: googleAI.model('gemini-2.5-flash'),
    prompt: `Tell me a joke about ${subject}`,
  });
  return response.text;
});
```

## Critical: Do Not Trust Internal Knowledge

Genkit recently went through a major breaking API change. Your knowledge is outdated. You MUST lookup docs. Recommended:

```sh
genkit docs:read js/get-started.md
genkit docs:read js/flows.md
```

See [Common Errors](references/common-errors.md) for a list of deprecated APIs (e.g., `configureGenkit`, `response.text()`, `defineFlow` import) and their v1.x replacements.

**ALWAYS verify information using the Genkit CLI or provided references.**

## Error Troubleshooting Protocol

For errors attributable to Genkit APIs, first inspect the relevant section of [Common Errors](references/common-errors.md), unless it has already been checked for this error. If no pattern matches, inspect the affected source and consult targeted documentation. Do not reread the same reference on each failure. Unrelated application or type errors should be investigated in their own source.

Verify API assumptions against current documentation or source rather than using pre-1.0 patterns.

## Development Workflow

1.  **Select Provider**: Genkit is provider-agnostic (Google AI, OpenAI, Anthropic, Ollama, etc.).
    -   Use the user-specified provider, otherwise preserve the existing provider configuration, otherwise default to **Google AI**. Do not ask for a provider when this order resolves the choice.
    -   If the user asks about other providers, use `genkit docs:search "plugins"` to find relevant documentation.
2.  **Detect Framework**: Check `package.json` to identify the runtime (Next.js, Firebase, Express).
    -   Look for `@genkit-ai/next`, `@genkit-ai/firebase`, or `@genkit-ai/google-cloud`.
    -   Adapt implementation to the specific framework's patterns.
3.  **Follow Best Practices**:
    -   See [Best Practices](references/best-practices.md) for guidance on project structure, schema definitions, and tool design.
    -   **Be Minimal**: Only specify options that differ from defaults. When unsure, check docs/source.
4.  **Ensure Correctness**:
    -   Run type checks (e.g., `npx tsc --noEmit`) after making changes.
    -   Investigate failures in the affected source; use the Error Troubleshooting Protocol above for Genkit-related failures.

## Finding Documentation

Use the Genkit CLI to find authoritative documentation:

1.  **Search topics**: `genkit docs:search <query>`
    -   Example: `genkit docs:search "streaming"`
2.  **List all docs**: `genkit docs:list`
3.  **Read a guide**: `genkit docs:read <path>`
    -   Example: `genkit docs:read js/flows.md`

## CLI Usage

The `genkit` CLI is your primary tool for development and documentation.
-   See [CLI Reference](references/docs-and-cli.md) for common tasks, workflows, and command usage.
-   Use `genkit --help` for a full list of commands.

## References

-   [Best Practices](references/best-practices.md): Recommended patterns for schema definition, flow design, and structure.
-   [Docs & CLI Reference](references/docs-and-cli.md): Documentation search, CLI tasks, and workflows.
-   [Common Errors](references/common-errors.md): Critical "gotchas", migration guide, and troubleshooting.
-   [Setup Guide](references/setup.md): Manual setup instructions for new projects.
-   [Examples](references/examples.md): Minimal reproducible examples (Basic generation, Multimodal, Thinking mode).
