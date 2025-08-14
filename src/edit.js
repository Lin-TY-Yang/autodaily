const { spawnSync } = require("child_process");

function edit(file) {
  const editor = process.env.EDITOR;
  if (!editor) {
    console.error(
      "EDITOR environment variable is not set. Please set it to your preferred editor (e.g., export EDITOR=vim)."
    );
    process.exit(1);
  }
  spawnSync(editor, [file], {
    stdio: "inherit",
  });
}

module.exports = edit;
