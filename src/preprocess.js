const STATUS_MAPPINGS = {
  Todo: ["開放", "Open"],
  "In Progress": ["進行中", "ESTIMATION", "PR MERGED"],
  Done: ["已關閉", "CLOSED", "STAGE READY(READY FOR QA)", "IN QA REVIEW"],
};

const categorize = (status) => {
  const result = Object.entries(STATUS_MAPPINGS)
    .filter(([_, values]) => values.includes(status))
    ?.map((entry) => entry[0])[0];
  return result ?? status;
};

function groupByStatus(issues) {
  const group = Object.fromEntries(
    Object.keys(STATUS_MAPPINGS).map((key) => [key, []])
  );
  return issues.reduce((groups, issue) => {
    const status = issue.fields.status?.name || "Unknown";
    const categorized = categorize(status);
    if (!groups[categorized]) groups[categorized] = [];
    groups[categorized].push(issue);
    return groups;
  }, group);
}

function preprocess(issues) {
  const grouped = groupByStatus(issues);

  if (grouped.Done) {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

    grouped.Done = grouped.Done.filter((issue) => {
      const updatedAt = new Date(issue.fields.updated);
      return updatedAt >= twentyFourHoursAgo;
    });

    if (grouped.Done.length === 0) {
      delete grouped.Done;
    }
  }
  return grouped;
}

module.exports = preprocess;
