const os = require("os");
const fs = require("fs");
const path = require("path");

function getShellProfile() {
  const shell = process.env.SHELL || "";
  if (shell.includes("bash")) {
    return path.join(os.homedir(), ".bash_profile");
  } else if (shell.includes("zsh")) {
    return path.join(os.homedir(), ".zshrc");
  } else if (shell.includes("fish")) {
    return path.join(os.homedir(), ".config", "fish", "config.fish");
  } else if (process.env.windir) {
    // PowerShell on Windows
    const documents = path.join(os.homedir(), "Documents");
    const powerShellDir = path.join(documents, "WindowsPowerShell");
    if (!fs.existsSync(powerShellDir)) {
      fs.mkdirSync(powerShellDir, { recursive: true });
    }
    return path.join(powerShellDir, "Microsoft.PowerShell_profile.ps1");
  }
  return null;
}

function getProfileContent(profilePath) {
  if (!profilePath || !fs.existsSync(profilePath)) {
    return null;
  }
  return fs.readFileSync(profilePath, "utf8");
}

function getExportStatement(key, value) {
  if (process.env.windir) {
    return `\n\$env:${key}="${value}"`;
  } else if ((process.env.SHELL || "").includes("fish")) {
    return `\nset -x ${key} ${value}`;
  } else {
    return `\nexport ${key}=${value}`;
  }
}

module.exports = {
  getExportStatement,
  getProfileContent,
  getShellProfile,
};
