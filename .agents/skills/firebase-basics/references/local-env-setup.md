# Firebase Local Environment Setup

Use this reference only for requested environment setup or a missing capability required by the task. Check only the relevant steps and reuse successful checks from the current environment.

## 1. Verify Node.js
- **Action**: Run `node --version`.
- **Handling**: Ensure Node.js is installed and the version is `>= 20`. If Node.js is missing or `< v20`, install it based on the operating system:

  **Recommended: Use a Node Version Manager**
  This avoids permission issues when installing global packages.

  **For macOS or Linux:**
  1. Guide the user to the [official nvm repository](https://github.com/nvm-sh/nvm#installing-and-updating).
  2. Request the user to manually install `nvm` and reply when finished. **Stop and wait** for the user's confirmation.
  3. Make `nvm` available in the current terminal session by sourcing the appropriate profile:
     ```bash
     # For Bash
     source ~/.bash_profile
     source ~/.bashrc

     # For Zsh
     source ~/.zprofile
     source ~/.zshrc
     ```
  4. Install Node.js:
     ```bash
     nvm install 24
     nvm use 24
     ```

  **For Windows:**
  1. Guide the user to download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).
  2. Request the user to manually install `nvm-windows` and Node.js, and reply when finished. **Stop and wait** for the user's confirmation.
  3. After the user confirms, verify Node.js is available:
     ```bash
     node --version
     ```

  **Alternative: Official Installer**
  1. Guide the user to download and install the LTS version from [nodejs.org](https://nodejs.org/en/download).
  2. Request the user to manually install Node.js and reply when finished. **Stop and wait** for the user's confirmation.

## 2. Verify Firebase CLI
- **Command**: `npx -y firebase-tools@latest --version`
- **Expected**: Successfully outputs a version string.

## 3. Verify Firebase Authentication
You must be authenticated to manage Firebase projects.
- **Action**: For authenticated remote operations only, inspect existing authentication with `npx -y firebase-tools@latest login:list` if unknown. Run `npx -y firebase-tools@latest login` only if authentication is missing or expired.
- **Handling**: If the environment is remote or restricted (no browser access), run `npx -y firebase-tools@latest login --no-localhost` instead.

## 4. Install Agent Skills and MCP Server
Install agent skills or an MCP server only when requested or required by the chosen operation. Use the one matching setup guide linked from `SKILL.md`; skip this step when available CLI or local tools suffice.

---
Only an unmet prerequisite needed by the current operation should block that operation. Continue independent work. Request manual installation or restart only when necessary and not already completed; do not repeat confirmation after tool evidence establishes readiness.
