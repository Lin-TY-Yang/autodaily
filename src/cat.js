const fs = require("fs");
const path = require("path");
const chrono = require("chrono-node");
const { getJournalPath } = require("./journal-utils");

function cat(args) {
  let audited = false;

  if (args.length > 0 && args[args.length - 1] === "audited") {
    audited = true;
    args.pop();
  }

  const date = chrono.parseDate(args[0] ?? "today");
  const filePath = getJournalPath(date, audited);

  if (fs.existsSync(filePath)) {
    console.log(fs.readFileSync(filePath, "utf8"));
  } else {
    console.error(`Journal file not found: ${path.basename(filePath)}`);
  }
}

module.exports = cat;
