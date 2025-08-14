const fs = require("fs");
const path = require("path");
const os = require("os");
const {
  STORAGE_DIR,
  JOURNALS_DIR,
  AUDIT_PROMPT_FILE,
} = require("../constants");

function init() {
  const homeDir = os.homedir();
  const autoDailyDir = path.join(homeDir, STORAGE_DIR);
  const journalsDir = path.join(autoDailyDir, JOURNALS_DIR);

  if (!fs.existsSync(autoDailyDir)) {
    fs.mkdirSync(autoDailyDir);
  }

  if (!fs.existsSync(journalsDir)) {
    fs.mkdirSync(journalsDir);
  }

  const auditPromptSource = path.join(__dirname, "..", AUDIT_PROMPT_FILE);
  const auditPromptDest = path.join(autoDailyDir, AUDIT_PROMPT_FILE);

  if (fs.existsSync(auditPromptSource) && !fs.existsSync(auditPromptDest)) {
    fs.copyFileSync(auditPromptSource, auditPromptDest);
  }
}

module.exports = init;
