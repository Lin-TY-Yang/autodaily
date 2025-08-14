const path = require("path");
const os = require("os");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const chrono = require("chrono-node");
const edit = require("./edit.js");

const { getLlmApiKey } = require("./credentials");
const {
  STORAGE_DIR,
  JOURNALS_DIR,
  AUDIT_PROMPT_FILE,
} = require("../constants");
const fetchTasks = require("./fetch-tasks.js");
const preprocess = require("./preprocess.js");
const getFormattedDate = require("./format-date");

function format(grouped) {
  const statusNames = Object.keys(grouped).sort();
  const finalIssuesCount = Object.values(grouped).reduce(
    (acc, val) => acc + val.length,
    0
  );

  if (finalIssuesCount === 0) {
    return "";
  }

  const output = [];
  for (const status of statusNames) {
    output.push(`## ${status}`);
    grouped[status].forEach((issue) => {
      output.push(`- [${issue.key}]: ${issue.fields.summary}`);
    });
    output.push("");
  }
  return output.join("\n");
}

function getJournalPath(date, audited = false) {
  const formattedDate = getFormattedDate(date);
  const fileName = audited
    ? `${formattedDate}-audited.md`
    : `${formattedDate}.md`;
  const homeDir = os.homedir();
  const journalsDir = path.join(homeDir, STORAGE_DIR, JOURNALS_DIR);
  return path.join(journalsDir, fileName);
}

async function createJournal() {
  const issues = await fetchTasks();
  const grouped = preprocess(issues);
  const output = format(grouped);
  const filePath = getJournalPath(new Date());
  fs.writeFileSync(filePath, output);
}

async function editJournal(args) {
  const audited = args[args.length - 1] === "audited";
  let dateString = args[0] === "audited" ? "today" : args[0] ?? "today";

  const date = chrono.parseDate(dateString);
  if (!date) {
    console.error(`Invalid date provided: ${dateString}`);
    process.exit(1);
  }

  const filePath = getJournalPath(date, audited);
  if (!fs.existsSync(filePath)) {
    console.error(`${path.basename(filePath)} not exists.`);
    process.exit(2);
  }

  edit(filePath);
}

async function auditJournal(date, verbose = false) {
  const apiKey = getLlmApiKey();
  if (!apiKey) {
    console.error(
      "LLM_API_KEY is not set. Please run 'autodaily llm-apikey <your_api_key>' to set it."
    );
    return;
  }
  const filePath = getJournalPath(date);
  if (!fs.existsSync(filePath)) {
    console.error(`Journal file not found: ${path.basename(filePath)}`);
    process.exit(1);
  }
  const journalContent = fs.readFileSync(filePath, "utf8");

  if (verbose) console.log("Generating nonsense ...");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const auditPromptPath = path.join(
    os.homedir(),
    STORAGE_DIR,
    AUDIT_PROMPT_FILE
  );
  if (!fs.existsSync(auditPromptPath)) {
    console.error(`Audit prompt file not found: ${auditPromptPath}`);
    return;
  }
  const auditPrompt = fs.readFileSync(auditPromptPath, "utf8");

  const prompt = `${auditPrompt}\n\nJournal Content:\n${journalContent}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    fs.writeFileSync(getJournalPath(date, true), content, "utf8");
    return content;
  } catch (error) {
    console.error("Error during AI audit:", error);
  }
}

module.exports = auditJournal;

module.exports = { getJournalPath, createJournal, editJournal, auditJournal };
