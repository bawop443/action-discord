const axios = require('axios');
const fs = require('fs');

const REQUIRED_ENV_VARS = [
  'GITHUB_EVENT_PATH',
  'GITHUB_REPOSITORY',
  'GITHUB_WORKFLOW',
  'GITHUB_ACTOR',
  'GITHUB_EVENT_NAME',
  'GITHUB_ACTION',
  'DISCORD_WEBHOOK',
  'GITHUB_JOB_STATUS'
];

process.env.GITHUB_ACTION = process.env.GITHUB_ACTION || '<missing GITHUB_ACTION env var>';

REQUIRED_ENV_VARS.forEach(env => {
  if (!process.env[env] || !process.env[env].length) {
    console.error(
      `Env var ${env} is not defined. Maybe try to set it if you are running the script manually.`
    );
    process.exit(1);
  }
});

const eventContent = fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8');

console.log("eventContent: ", eventContent)

discordNotify(
  process.env.GITHUB_JOB_STATUS,
  process.env.GITHUB_WORKFLOW,
  process.env.DISCORD_USERNAME,
  process.env.DISCORD_AVATAR,
  JSON.parse(eventContent),
  process.env.DISCORD_WEBHOOK
)

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

  const payload = {
    username: username || 'MC - Deploy Notification',
    avatar_url: avatarUrl || 'https://cdn.discordapp.com/attachments/988683025942454312/1095604009252966482/image_1.png?ex=666fdebf&is=666e8d3f&hm=8a919283a14b81683dc7cc5a4aa61e5117fc8769f8ac85bcb4d4fe1f24263e61&',
    embeds: [
      {
        author: {
          name: eventContent.sender?.login,
          url: eventContent.sender?.html_url,
          icon_url: eventContent.sender?.avatar_url
        },
        color: color,
        title: title,
        url: eventContent.head_commit?.url + '/checks',
        description: 
        `**Workflow**: ${workflow}
        **Repository**: ${process.env.GITHUB_REPOSITORY}
        **Commit**: ${eventContent.commits}`
      }
    ]
  }

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