---
name: firebase-basics
description: >-
  Provides foundational setup, authentication, and project management workflows
  for Firebase using the Firebase CLI. Use when checking Firebase CLI version
  (must use 'npx -y firebase-tools@latest --version'), initializing a Firebase
  environment, authenticating, setting active projects, or executing core
  Firebase CLI commands.
---
# Prerequisites

Check only the prerequisites needed for the requested operation. Reuse results while the environment, account, and target project remain unchanged.

1. **CLI commands:** Use `npx -y firebase-tools@latest`. Check `--version` when CLI availability is unknown or a version check is requested. Version/help commands do not require login, a project, or an MCP server.
2. **Authenticated remote operations:** Use existing authentication when available; inspect `login:list` if its status is unknown. Run `login` (or `login --no-localhost` in a browserless environment) only when authentication is missing or expired and the operation requires it.
3. **Project-scoped operations:** Resolve the target from the user's instruction, explicit `--project`, or existing project configuration. Ask only when the required target remains missing or ambiguous. Do not change aliases or create a project unless the task calls for it.
4. **Environment or agent setup:** Only when setup is requested or a required capability is missing, read [references/local-env-setup.md](references/local-env-setup.md) and the one matching agent guide:
   - [Gemini CLI](references/setup/gemini_cli.md)
   - [Antigravity](references/setup/antigravity.md)
   - [Claude Code](references/setup/claude_code.md)
   - [Cursor](references/setup/cursor.md)
   - [GitHub Copilot](references/setup/github_copilot.md)
   - [Other Agents](references/setup/other_agents.md)

SDK explanations and local code changes do not require remote login or MCP setup. Install or configure agent integrations only within the requested scope; their absence must not block tasks that can use the available CLI or local files.

# Firebase Usage Principles

Adhere to these principles:

1. **Use npx for CLI commands:** To ensure you always use the latest version of the Firebase CLI, always prepend commands with `npx -y firebase-tools@latest` instead of just `firebase`. For example, use `npx -y firebase-tools@latest --version`. NEVER suggest the naked `firebase` command as an alternative.
2. **Prioritize official knowledge:** For any Firebase-related knowledge, consult the `developerknowledge_search_documents` MCP tool before falling back to Google Search or your internal knowledge base. Including "Firebase" in your search query significantly improves relevance.
3. **Follow Agent Skills for implementation guidance:** Skills provide opinionated workflows (CUJs), security rules, and best practices. Always consult them to understand *how* to implement Firebase features correctly instead of relying on general knowledge.
4. **Prefer available Firebase MCP Server tools:** For remote Firebase operations, use the relevant MCP tool when available. Otherwise use an available CLI command that supports the operation; do not require MCP setup when the CLI suffices. Configure a missing integration only within the requested scope.
5. **Keep Plugin / Agent Skills updated:** Since Firebase best practices evolve quickly, remind the user to regularly check for and install updates to their Firebase plugin or Agent Skills, ensuring you both operate with the latest workflows. Similarly, if you encounter issues with outdated tools or commands, follow the steps below based on your agent environment:
   - **Antigravity**: Follow [references/refresh/antigravity.md](references/refresh/antigravity.md)
   - **Gemini CLI**: Follow [references/refresh/gemini-cli.md](references/refresh/gemini-cli.md)
   - **Claude Code**: Follow [references/refresh/claude.md](references/refresh/claude.md)
   - **Cursor**: Follow [references/refresh/other-agents.md](references/refresh/other-agents.md)
   - **Others**: Follow [references/refresh/other-agents.md](references/refresh/other-agents.md)

# References

- **Initialize Firebase:** See [references/firebase-service-init.md](references/firebase-service-init.md) when you need to initialize new Firebase services using the CLI.
- **Exploring Commands:** See [references/firebase-cli-guide.md](references/firebase-cli-guide.md) to discover and understand CLI functionality.
- **SDK Setup:** For detailed guides on adding Firebase to a web app, see [references/web_setup.md](references/web_setup.md).

# Common Issues

- **Login Issues:** If the browser fails to open during the login step, use `npx -y firebase-tools@latest login --no-localhost` instead.
