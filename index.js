#!/usr/bin/env node

const atocha = require("atocha");
const listr = require("listr");
const meow = require("meow");

const { pull, push, save, start } = require("./src/index.js");

const cli = meow(`
  Usage
    $ happy
    $ happy save
    $ happy save "Message here"

  Options
    --watch   [Not yet] rerun the command when there's a file change
    --as NAME [Not yet] save in a branch with that name

  Examples
    $ happy save
    ✔ Adding files
    ✔ Committing changes
    ✔ Pulling from master
    ✔ Pushing

    $ happy save "Fixed that damn bug that killed the staging database"
    ✔ Adding files
    ✔ Committing changes
    ✔ Pulling from master
    ✔ Pushing
`);

// ISO 8601 without milliseconds (which is still ISO 8601)
const time = () => new Date().toISOString().replace(/\.[0-9]{3}/, "");

const [actionName = "start"] = cli.input;

const actions = {
  start: [start],
  save: [save, pull, push]
};

const action = actions[actionName];
if (!action) {
  console.error(
    `No action named "${actionName}" found. Available actions are:${Object.keys(
      actions
    )
      .map(act => `\n$ happy ${act}`)
      .join("")}

Run "happy --help" for more info`
  );
  process.exit(1);
}

const tasks = new listr(actions[actionName]);

tasks.run().catch(err => {
  console.error("ERROR:", err);
});
