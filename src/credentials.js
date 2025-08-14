const fs = require("fs");
const { getShellProfile, getExportStatement } = require("./shell-config");

function getCredentials() {
  const email = process.env.VS_ACCOUNT;
  const accessToken = process.env.JIRA_ACCESS_TOKEN;

  if (email && accessToken) {
    return { email, accessToken };
  }

  return null;
}

function saveCredentials(email, accessToken) {
  if (getCredentials()) {
    console.log(
      "Credentials already exist in your shell profile. To update them, please edit your profile file directly."
    );
    return;
  }

  const profilePath = getShellProfile();
  if (!profilePath) {
    console.error(
      "Could not determine shell profile path. Supported shells: bash, zsh, fish, powershell"
    );
    process.exit(1);
  }

  const exportStatement =
    getExportStatement("VS_ACCOUNT", email) +
    getExportStatement("JIRA_ACCESS_TOKEN", accessToken);

  fs.appendFileSync(profilePath, `${exportStatement}\n`);
  console.log(`Credentials saved to ${profilePath}`);
  console.log(
    "Please restart your shell or source your profile to apply the changes."
  );
}

function getLlmApiKey() {
  return process.env.LLM_API_KEY || null;
}

function saveLlmApiKey(apiKey) {
  if (getLlmApiKey()) {
    console.log(
      "LLM_API_KEY already exists in your shell profile. To update it, please edit your profile file directly."
    );
    return;
  }

  const profilePath = getShellProfile();
  if (!profilePath) {
    console.error(
      "Could not determine shell profile path. Supported shells: bash, zsh, fish, powershell"
    );
    process.exit(1);
  }

  const exportStatement = getExportStatement("LLM_API_KEY", apiKey);

  fs.appendFileSync(profilePath, `${exportStatement}\n`);
  console.log(`LLM_API_KEY saved to ${profilePath}`);
  console.log(
    "Please restart your shell or source your profile to apply the changes."
  );
}

module.exports = {
  getCredentials,
  saveCredentials,
  getLlmApiKey,
  saveLlmApiKey,
};
