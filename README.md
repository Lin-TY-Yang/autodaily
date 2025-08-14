# AutoDaily

A command-line tool for automating daily work journal creation and management using AI-powered auditing.

## Overview

AutoDaily is a Node.js CLI application that helps developers maintain daily work journals by:
- Fetching tasks from JIRA
- Creating structured daily journal entries
- Using AI (Google Gemini) to audit and enhance journal content
- Providing easy access to view, edit, and manage journal entries

## Features

- **Journal Management**: Create, view, edit, and list daily journal entries
- **AI Auditing**: Automatically enhance journal entries with AI-generated work details
- **JIRA Integration**: Fetch tasks from JIRA for journal creation
- **CLI Interface**: Simple command-line interface for all operations
- **Cross-platform**: Works on macOS, Linux, and Windows

## Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- JIRA account with API access
- Google Gemini API key

## Installation

### Development Setup
Install dependencies:
```bash
npm install
```

3. Set up your credentials:
```bash
# Set JIRA credentials
npm start auth <email> <access-token>

# Set LLM API key
npm start llm-apikey <api-key>
```

## Development

### Project Structure

```
autodaily/
├── src/                    # Source code
│   ├── cat.js            # Display journal content
│   ├── credentials.js    # Credential management
│   ├── edit.js           # File editing utilities
│   ├── fetch-tasks.js    # JIRA task fetching
│   ├── format-date.js    # Date formatting utilities
│   ├── init.js           # Initialization and setup
│   ├── journal-utils.js  # Journal file operations
│   ├── list.js           # Journal listing
│   ├── preprocess.js     # Data preprocessing
│   └── shell-config.js   # Shell configuration
├── main.js               # Main CLI entry point
├── constants.js          # Application constants
├── audit-prompt.md       # AI audit prompt template
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

### Key Components

- **`main.js`**: CLI command router and main application logic
- **`src/init.js`**: Sets up storage directories and initializes the application
- **`src/journal-utils.js`**: Core journal file operations (create, edit, audit)
- **`src/credentials.js`**: Secure credential storage and retrieval
- **`src/fetch-tasks.js`**: JIRA API integration for task fetching

### Development Workflow

1. **Local Development**: Run commands directly with Node.js
   ```bash
   node main.js <command> [options]
   ```

2. **Testing Changes**: Test your modifications locally before building
   ```bash
   node main.js help
   node main.js ls
   ```

3. **Debugging**: Use Node.js debugging tools
   ```bash
   node --inspect main.js <command>
   ```

## Building
### Build Commands

#### macOS ARM64 (Apple Silicon)
```bash
npm run build:macos-arm64
```

This creates a standalone executable in the `dist/` directory.

### Adding New Build Targets

To add support for additional platforms, add new scripts to `package.json`:

```json
{
  "scripts": {
    "build:macos-arm64": "pkg main.js --targets node20-macos-arm64 --output dist/autodaily",
    "build:macos-x64": "pkg main.js --targets node20-macos-x64 --output dist/autodaily-x64",
    "build:linux-x64": "pkg main.js --targets node20-linux-x64 --output dist/autodaily-linux",
    "build:win-x64": "pkg main.js --targets node20-win-x64 --output dist/autodaily.exe"
  }
}
```

### Storage Locations

- **Journals**: `~/.autodaily/journals/`
- **Audit Prompt**: `~/.autodaily/audit-prompt.md`

### Troubleshooting

#### Common Issues

1. **Credentials Not Found**: Re-run the auth commands and source your shell profile
   ```bash
   autodaily auth <email> <token>
   autodaily llm-apikey <key>
   source <your bash profile>
   ```
