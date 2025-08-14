const chrono = require("chrono-node");

function getFormattedDate(date) {
  const d = chrono.parseDate(date.toString());
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

module.exports = getFormattedDate;
