const fs = require("fs");
const path = require("path");
const os = require("os");
const { JOURNALS_DIR, STORAGE_DIR } = require("../constants");

function listJournals() {
  const homeDir = os.homedir();
  const journalsDirPath = path.join(homeDir, STORAGE_DIR, JOURNALS_DIR);

  if (!fs.existsSync(journalsDirPath)) {
    console.log("No journals found.");
    return;
  }

  const files = fs.readdirSync(journalsDirPath);
  if (files.length === 0) {
    console.log("No journals found.");
    return;
  }

  files.forEach((file) => console.log(`- ${file}`));
}

module.exports = listJournals;
