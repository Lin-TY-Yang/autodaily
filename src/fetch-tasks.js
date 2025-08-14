const JIRA_DOMAIN = "viewsonic-vsi.atlassian.net";
const { getCredentials } = require("./credentials.js");

async function fetchTasks() {
  const credentials = getCredentials();
  if (!credentials) {
    console.log(
      "No credentials found. please run 'autodaily auth <name> <jira_access_token>' first"
    );
    process.exit(1);
  }
  const { email, accessToken } = credentials;
  const auth = Buffer.from(`${email}:${accessToken}`).toString("base64");

  const jql =
    "assignee=currentUser() AND resolution=Unresolved ORDER BY priority DESC";
  const encodedJQL = encodeURIComponent(jql);
  const maxResults = 50;

  const url = `https://${JIRA_DOMAIN}/rest/api/2/search?jql=${encodedJQL}&maxResults=${maxResults}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Jira API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.issues || [];
  } catch (error) {
    console.error("Error fetching Jira issues:", error.message);
    return [];
  }
}

module.exports = fetchTasks;
