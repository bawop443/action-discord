const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');
const { join } = require('path');

const shouldNotiLine = core.getInput('line');
const shouldNotiDiscord = core.getInput('discord');

const REQUIRED_ENV_VARS = [
  'GITHUB_EVENT_PATH',
  'GITHUB_REPOSITORY',
  'GITHUB_WORKFLOW',
  'GITHUB_ACTOR',
  'GITHUB_EVENT_NAME',
  'GITHUB_ACTION',
  'DISCORD_WEBHOOK',
  'GITHUB_JOB_STATUS',
  'GITHUB_RUN_ID'
];

REQUIRED_ENV_VARS.forEach(env => {
  if (!process.env[env] || !process.env[env].length) {
    console.error(
      `Env var ${env} is not defined. Maybe try to set it if you are running the script manually.`
    );
    process.exit(1);
  }
});

const eventPayload = github.context.payload;

console.log("eventPayload: ", eventPayload)
console.log("shouldNotiDiscord: ", shouldNotiDiscord)
console.log("shouldNotiLine: ", shouldNotiLine)

if (shouldNotiDiscord === 'true') {
  discordNotify(
    process.env.GITHUB_JOB_STATUS,
    process.env.GITHUB_WORKFLOW,
    process.env.DISCORD_USERNAME,
    process.env.DISCORD_AVATAR,
    eventPayload,
    process.env.DISCORD_WEBHOOK
  )
}

if (shouldNotiLine === 'true') {

}

async function discordNotify(jobStatus, workflow, username, avatarUrl, eventContent, discordWebhookUrl) {
  let color
  let title
  if (jobStatus == "success") {
    title = "Action is successful."
    color = "5162540"
  } else if (jobStatus == "failure") {
    title = "Action has failed."
    color = "16711680"
  } else if (jobStatus == "cancelled") {
    title = "Action is cancelled."
    color = "8421504"
  } else {
    title = `Action is ${jobStatus}.`
  }

  const descriptionObj = JSON.parse(JSON.stringify({
    'Repository': `[${process.env.GITHUB_REPOSITORY}](${eventContent.repository.html_url})`,
    'Workflow': workflow,
    'Ref name': process.env.GITHUB_REF_NAME
  }))
  const description = getDiscordDescription(descriptionObj, eventContent)

  const payload = {
    username: username || 'MC - Deploy Notification',
    avatar_url: avatarUrl || 'https://cdn.discordapp.com/attachments/988683025942454312/1095604009252966482/image_1.png?ex=666fdebf&is=666e8d3f&hm=8a919283a14b81683dc7cc5a4aa61e5117fc8769f8ac85bcb4d4fe1f24263e61&',
    embeds: [
      {
        author: {
          name: eventContent.sender?.login || process.env.GITHUB_ACTOR,
          url: eventContent.sender?.html_url,
          icon_url: eventContent.sender?.avatar_url
        },
        color: color,
        title: title,
        url: `${eventContent.repository.html_url}/actions/runs/${process.env.GITHUB_RUN_ID}`,
        description: description
      }
    ]
  }

  console.log("payload", JSON.stringify(payload))

  try {
    console.log('Sending message ...');
    await axios.post(
      `${discordWebhookUrl}?wait=true`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
      },
    );
    console.log('Message sent ! Shutting down ...');
    process.exit(0);
  } catch (error) {
    console.error('Error :', error.response.status, error.response.statusText);
    console.error('Full Error: ', error)
    console.error('Message :', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

function getDiscordDescription(descriptionObj, eventContent) {
  let description = ''
  for (const key of Object.keys(descriptionObj)) {
    description += `**${key}**: ${descriptionObj[key]}\n\n`
  }
  if (eventContent.commits?.length) {
    description += `**Commit**: [${eventContent.commits?.length} new commits](${eventContent.compare})\n`
    for (let i = 0; i < 5 && i < eventContent.commits.length ; i++) {
      description += `- [\`${eventContent.commits[i].id.slice(0, 7)}\`](${eventContent.commits[i].url}) ${eventContent.commits[i].message} - ${eventContent.commits[i].author?.username || eventContent.commits[i].committer?.username}\n`
    }
  }
  return description
}

// function getCommitMessage(commits, headCommit) {
//   if (commits === null) {
//     return `Build ${ process.env.GITHUB_REPOSITORY }#${ process.env.GITHUB_REF_NAME }\nManually build by ${ process.env.GITHUB_ACTOR }\n`
//   }
//   let stringCommits = ''
//   for (let i = 0; i < 5 && i < commits.length-1 ; i++) {
//     stringCommits += `- ${commits[i].message} by ${commits[i].author.username}\n`
//   }
//   if (commits.length > 5) {
//     stringCommits += `... and ${commits.length - 5} more commit(s)\n`
//   }
//   let message = `Triggered ${ process.env.GITHUB_REPOSITORY }#${ process.env.GITHUB_REF_NAME }\nBuild triggered by ${ headCommit.author.username } with commit message: ${ headCommit.message }\n`
//   if (stringCommits) {
//     message += `\nCommits:\n${stringCommits}`
//   }
//   return message
// }