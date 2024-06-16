const axios = require('axios');
const fs = require('fs');
const _ = require('lodash');
const { argv } = require('yargs');

const REQUIRED_ENV_VARS = [
  'GITHUB_EVENT_PATH',
  'GITHUB_REPOSITORY',
  'GITHUB_WORKFLOW',
  'GITHUB_ACTOR',
  'GITHUB_EVENT_NAME',
  'GITHUB_ACTION',
  'DISCORD_WEBHOOK',
  'GITHUB_EVENT_COMMITS',
  'GITHUB_EVENT_HEAD_COMMIT'
];

process.env.GITHUB_ACTION = process.env.GITHUB_ACTION || '<missing GITHUB_ACTION env var>';

console.log("process.env:", process.env)
console.log("GITHUB_EVENT_COMMITS", JSON.parse(process.env.GITHUB_EVENT_COMMITS))
console.log("GITHUB_EVENT_HEAD_COMMIT", JSON.parse(process.env.GITHUB_EVENT_HEAD_COMMIT))
console.log("argv", argv)

REQUIRED_ENV_VARS.forEach(env => {
  if (!process.env[env] || !process.env[env].length) {
    console.error(
      `Env var ${env} is not defined. Maybe try to set it if you are running the script manually.`
    );
    process.exit(1);
  }
});

const eventContent = fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8');

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

let url;
let payload;

if (argv._.length === 0 && !process.env.DISCORD_EMBEDS) {
  // If argument and embeds NOT provided, let Discord show the event informations.
  url = `${process.env.DISCORD_WEBHOOK}/github`;
  payload = JSON.stringify(JSON.parse(eventContent));
} else {
  // Otherwise, if the argument or embeds are provided, let Discord override the message.
  const args = argv._.join(' ');
  const message = _.template(args)({ ...process.env, EVENT_PAYLOAD: JSON.parse(eventContent) });
  console.log("message", message)
  let embedsObject;
  let content;
  try {
    const commits = JSON.parse(process.env.GITHUB_EVENT_COMMITS);
    const headCommit = JSON.parse(process.env.GITHUB_EVENT_HEAD_COMMIT);
    content = getCommitMessage(commits, headCommit)
  } catch (parseErr) {
    console.error('Error parsing DISCORD_EMBEDS :' + parseErr);
    process.exit(1);
  }

  if (message) {
    content += `\n${ message }`
  }

  url = process.env.DISCORD_WEBHOOK;
  payload = JSON.stringify({
    content: content,
    ...process.env.DISCORD_EMBEDS && { embeds: embedsObject },
    ...process.env.DISCORD_USERNAME && { username: process.env.DISCORD_USERNAME },
    ...process.env.DISCORD_AVATAR && { avatar_url: process.env.DISCORD_AVATAR },
  });
}

// curl -X POST -H "Content-Type: application/json" --data "$(cat $GITHUB_EVENT_PATH)" $DISCORD_WEBHOOK/github

(async () => {
  console.log('Sending message ...');
  await axios.post(
    `${url}?wait=true`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-GitHub-Event': process.env.GITHUB_EVENT_NAME,
      },
    },
  );
  console.log('Message sent ! Shutting down ...');
  process.exit(0);
})().catch(err => {
  console.error('Error :', err.response.status, err.response.statusText);
  console.error('Message :', err.response ? err.response.data : err.message);
  process.exit(1);
});

function getCommitMessage(commits, headCommit) {
  if (commits === null) {
    return `Build ${ process.env.GITHUB_REPOSITORY }#${ process.env.GITHUB_REF_NAME }\nManually build by ${ process.env.GITHUB_ACTOR }\n`
  }
  let stringCommits = ''
  for (let i = 0; i < 5 && i < commits.length-1 ; i++) {
    stringCommits += `- ${commits[i].message} by ${commits[i].author.username}\n`
  }
  if (commits.length > 5) {
    stringCommits += `... and ${commits.length - 5} more commit(s)\n`
  }
  let message = `Triggered ${ process.env.GITHUB_REPOSITORY }#${ process.env.GITHUB_REF_NAME }\nBuild triggered by ${ headCommit.author.username } with commit message: ${ headCommit.message }\n`
  if (stringCommits) {
    message += `\nCommits:\n${stringCommits}`
  }
  return message
}