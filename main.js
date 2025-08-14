const helpText = `
Usage: autodaily <command> [options]

Commands:
  autodaily improvise                The magic command to do it all for you

  autodaily [audited]                Fetch and create today's journal. Add "audited" to view the audited version.
  autodaily help                     Display this help message.
  autodaily ls                       List all existing journal files.
  autodaily cat [date] [audited]     Display journal content for a specific date. 
  autodaily edit [date] [audited]    Open a journal file for editing. Add "audited" to edit the audited version.
  autodaily auth [name] [token]      Set or display JIRA credentials.
  autodaily llm-apikey [api_key]     Set or display LLM API key.
  autodaily audit [date]             Audit a journal entry using the LLM. Defaults to today's journal.
  autodaily prompt [edit]            Display the audit prompt or open it for editing.
`;

// Import required modules
const init = require("./src/init");
const listJournals = require("./src/list");
const cat = require("./src/cat");
const {
  getCredentials,
  saveCredentials,
  getLlmApiKey,
  saveLlmApiKey,
} = require("./src/credentials");
const {
  createJournal,
  editJournal,
  auditJournal,
  getJournalPath,
} = require("./src/journal-utils");
const { STORAGE_DIR, AUDIT_PROMPT_FILE } = require("./constants");
const fs = require("fs");
const path = require("path");
const os = require("os");
const chrono = require("chrono-node");

// Command handler functions
async function handleImprovise() {
  await createJournal();
  const today = new Date();
  await auditJournal(today, true);
}

function handleList() {
  listJournals();
}

function handleCat(args) {
  cat(args);
}

async function handleEdit(args) {
  await editJournal(args);
}

function handleAuth(args) {
  if (args.length === 0) {
    const credentials = getCredentials();
    if (credentials) {
      console.log(`Email: ${credentials.email}`);
      console.log("Access Token: [hidden]");
    } else {
      console.log("No credentials found.");
    }
  } else if (args.length === 2) {
    const [name, token] = args;
    saveCredentials(name, token);
  } else {
    console.error("Usage: autodaily auth <name> <token>");
    process.exit(1);
  }
}

function handleLlmApiKey(args) {
  if (args.length === 0) {
    const apiKey = getLlmApiKey();
    if (apiKey) {
      console.log("LLM API Key: [hidden]");
    } else {
      console.log("No LLM API key found.");
    }
  } else if (args.length === 1) {
    const [apiKey] = args;
    saveLlmApiKey(apiKey);
  } else {
    console.error("Usage: autodaily llm-apikey <api_key>");
    process.exit(1);
  }
}

async function handleAudit(args) {
  let auditDate = new Date();
  if (args.length > 0) {
    auditDate = chrono.parseDate(args[0]);
    if (!auditDate) {
      console.error(`Invalid date: ${args[0]}`);
      process.exit(1);
    }
  }
  await auditJournal(auditDate, true);
}

function handlePrompt(args) {
  const homeDir = os.homedir();
  const promptPath = path.join(homeDir, STORAGE_DIR, AUDIT_PROMPT_FILE);

  if (args.length > 0 && args[0] === "edit") {
    const edit = require("./src/edit");
    edit(promptPath);
  } else {
    if (fs.existsSync(promptPath)) {
      console.log(fs.readFileSync(promptPath, "utf8"));
    } else {
      console.error(`Audit prompt file not found: ${promptPath}`);
      process.exit(1);
    }
  }
}

async function main() {
  // Initialize storage directories
  init();

  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "audited") {
    const today = new Date();
    const journal = getJournalPath(today);
    if (!fs.existsSync(journal)) await createJournal();
    const catArgs = ["today"];
    if (command === "audited") catArgs.push("audited");
    cat(catArgs);
    process.exit(0);
  }

  switch (command) {
    case "improvise":
      await handleImprovise();
      break;

    case "help":
      console.log(helpText);
      break;

    case "ls":
      handleList();
      break;

    case "cat":
      handleCat(args);
      break;

    case "edit":
      await handleEdit(args);
      break;

    case "auth":
      handleAuth(args);
      break;

    case "llm-apikey":
      handleLlmApiKey(args);
      break;

    case "audit":
      await handleAudit(args);
      break;

    case "prompt":
      handlePrompt(args);
      break;

    default:
      console.log(helpText);
      process.exit(1);
  }
}

main();
