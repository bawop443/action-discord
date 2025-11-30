const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

const shouldNotiLine = core.getInput('line');
const shouldNotiDiscord = core.getInput('discord');

const REQUIRED_ENV_VARS = [
  'GITHUB_EVENT_PATH',
  'GITHUB_REPOSITORY',
  'GITHUB_WORKFLOW',
  'GITHUB_ACTOR',
  'GITHUB_EVENT_NAME',
  'GITHUB_ACTION',
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

if (shouldNotiDiscord === 'true') {
  const notiObj = {
    jobStatus: process.env.GITHUB_JOB_STATUS,
    workflow: process.env.GITHUB_WORKFLOW,
    username: process.env.DISCORD_USERNAME,
    avatarUrl: process.env.DISCORD_AVATAR,
    eventContent: eventPayload,
    additionalDesc: process.env.ADDITIONAL_DESCRIPTION
  }
  discordNotify(notiObj)
}

if (shouldNotiLine === 'true') {
  // const notiObj = {
  //   jobStatus: process.env.GITHUB_JOB_STATUS,
  //   workflow: process.env.GITHUB_WORKFLOW,
  //   eventContent: eventPayload,
  //   additionalDesc: process.env.ADDITIONAL_DESCRIPTION
  // };
  // lineNotify(notiObj);
}

async function discordNotify({ jobStatus, workflow, username, avatarUrl, eventContent, additionalDesc }) {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK;

  if (!discordWebhookUrl) {
    console.error('DISCORD_WEBHOOK is not defined');
    return;
  }

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

  try {
    additionalDesc = JSON.parse(additionalDesc)
  } catch (error) {
    console.log("parse ADDITIONAL_DESCRIPTION error: ", error)
    additionalDesc = {}
  }

  const descriptionObj = JSON.parse(JSON.stringify({
    'Repository': `[${process.env.GITHUB_REPOSITORY}](${eventContent.repository.html_url})`,
    'Workflow': workflow,
    'Ref name': process.env.GITHUB_REF_NAME
  }))
  const description = getDiscordDescription(Object.assign(descriptionObj, additionalDesc), eventContent)

  const payload = {
    username: username || 'MC - Deploy Notification',
    avatar_url: avatarUrl || 'https://cdn.discordapp.com/attachments/988683025942454312/1268082301942632480/IMG_6667.png?ex=66ab212c&is=66a9cfac&hm=21ce38167bfb7cd41eea5d77a7e0562d47767f35af7eb6ff53a22803ef8883f4&',
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

  console.log("payload", JSON.stringify(payload, null, 2))

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
    // process.exit(0);
  } catch (error) {
    console.error('Error :', error.response.status, error.response.statusText);
    console.error('Full Error: ', error)
    console.error('Message :', error.response ? error.response.data : error.message);
    // process.exit(1);
  }
}

async function lineNotify({ jobStatus, workflow, eventContent, additionalDesc }) {
  const channelToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.LINE_DEST_ID;

  if (!channelToken || !to) {
    console.error('LINE_CHANNEL_ACCESS_TOKEN or LINE_DEST_ID is not defined');
    return;
  }

  let statusEmoji;
  let statusText;
  let statusColor;

  if (jobStatus === 'success') {
    statusEmoji = '✅';
    statusText = 'SUCCESS';
    statusColor = '#22c55e'; // green
  } else if (jobStatus === 'failure') {
    statusEmoji = '❌';
    statusText = 'FAILURE';
    statusColor = '#ef4444'; // red
  } else if (jobStatus === 'cancelled') {
    statusEmoji = '⚪️';
    statusText = 'CANCELLED';
    statusColor = '#9ca3af'; // gray
  } else {
    statusEmoji = 'ℹ️';
    statusText = (jobStatus || 'UNKNOWN').toUpperCase();
    statusColor = '#3b82f6'; // blue
  }

  // parse additionalDesc (ใช้ร่วมกับฝั่ง Discord)
  try {
    additionalDesc = JSON.parse(additionalDesc);
  } catch (error) {
    console.log("parse ADDITIONAL_DESCRIPTION error (LINE): ", error);
    additionalDesc = {};
  }

  const repoName = process.env.GITHUB_REPOSITORY;
  const repoUrl = eventContent.repository?.html_url;
  const runUrl = `${repoUrl}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  const compareUrl = eventContent.compare;
  const refName = process.env.GITHUB_REF_NAME;
  const actor = eventContent.sender?.login || process.env.GITHUB_ACTOR;
  const commits = eventContent.commits || [];

  // summary key-value (จะเอาไป map เป็น box ใน Flex)
  const summaryItems = [
    { label: 'Repository', value: repoName },
    { label: 'Workflow', value: workflow },
    { label: 'Ref',       value: refName },
    // { label: 'Actor',     value: actor },
  ];

  for (const key of Object.keys(additionalDesc)) {
    summaryItems.push({ label: key, value: String(additionalDesc[key]) });
  }

  // แปลง summaryItems → contents ของ Flex
  const summaryBoxes = summaryItems.map(item => ({
    type: 'box',
    layout: 'baseline',
    spacing: 'sm',
    contents: [
      {
        type: 'text',
        text: item.label,
        flex: 3,
        size: 'xs',
        color: '#9ca3af'
      },
      {
        type: 'text',
        text: item.value,
        flex: 7,
        size: 'xs',
        wrap: true,
        color: '#ffffff'
      }
    ]
  }));

  // commit list (เอา top 3 พอ)
  const commitBoxes = [];
  if (commits.length) {
    for (let i = 0; i < 3 && i < commits.length; i++) {
      const c = commits[i];
      const shortId = c.id.slice(0, 7);
      const msg = c.message;
      const authorName = c.author?.username || c.committer?.username || c.author?.name || 'unknown';

      commitBoxes.push({
        type: 'box',
        layout: 'vertical',
        spacing: 'xs',
        contents: [
          {
            type: 'text',
            text: `${shortId} · ${authorName}`,
            size: 'xs',
            weight: 'bold',
            color: '#e5e7eb'
          },
          {
            type: 'text',
            text: msg,
            size: 'xs',
            wrap: true,
            color: '#d1d5db'
          }
        ]
      });
    }
  }

  const hasCommits = commitBoxes.length > 0;

  const flexBubble = {
    type: 'bubble',
    size: 'mega',
    styles: {
      body: {
        backgroundColor: '#020617' // dark slate
      },
      footer: {
        backgroundColor: '#020617'
      },
      header: {
        backgroundColor: '#020617'
      }
    },
    header: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '16px',
      contents: [
        {
          type: 'box',
          layout: 'baseline',
          spacing: 'sm',
          contents: [
            {
              type: 'text',
              text: `${statusEmoji}  Deploy ${statusText}`,
              weight: 'bold',
              size: 'md',
              color: '#f9fafb'
            }
          ]
        },
        {
          type: 'box',
          layout: 'baseline',
          margin: 'sm',
          contents: [
            {
              type: 'text',
              text: repoName,
              size: 'xs',
              color: '#9ca3af',
              wrap: true
            }
          ]
        }
      ]
    },
    body: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '16px',
      spacing: 'md',
      contents: [
        // status pill
        {
          type: 'box',
          layout: 'horizontal',
          paddingAll: '6px',
          cornerRadius: '999px',
          backgroundColor: `${statusColor}1A`,
          contents: [
            {
              type: 'text',
              text: statusText,
              size: 'xs',
              weight: 'bold',
              color: statusColor,
              align: 'center'
            }
          ]
        },
        // summary section
        {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          margin: 'md',
          contents: [
            {
              type: 'text',
              text: 'Summary',
              size: 'sm',
              weight: 'bold',
              color: '#e5e7eb'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              margin: 'xs',
              contents: summaryBoxes
            }
          ]
        },
        // commit section
        ...(hasCommits ? [{
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          margin: 'md',
          contents: [
            {
              type: 'text',
              text: `Commits (${commits.length})`,
              size: 'sm',
              weight: 'bold',
              color: '#e5e7eb'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              margin: 'xs',
              contents: commitBoxes
            }
          ]
        }] : [])
      ]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      paddingAll: '12px',
      contents: [
        {
          type: 'button',
          style: 'primary',
          height: 'sm',
          color: statusColor,
          action: {
            type: 'uri',
            label: 'View Run',
            uri: runUrl
          }
        },
        {
          type: 'button',
          style: 'secondary',
          height: 'sm',
          action: {
            type: 'uri',
            label: 'View Repo',
            uri: repoUrl
          }
        },
        ...(compareUrl ? [{
          type: 'button',
          style: 'secondary',
          height: 'sm',
          action: {
            type: 'uri',
            label: 'View Diff',
            uri: compareUrl
          }
        }] : [])
      ]
    }
  };

  const payload = {
    to,
    messages: [
      {
        type: 'flex',
        altText: `[DEPLOY] ${statusText} - ${repoName} (${refName})`,
        contents: flexBubble
      }
    ]
  };

  console.log("LINE FLEX payload", JSON.stringify(payload, null, 2));

  try {
    console.log('Sending LINE Flex message ...');
    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${channelToken}`
        }
      }
    );
    console.log('LINE Flex message sent!');
  } catch (error) {
    console.error('LINE Error :', error.response?.status, error.response?.statusText);
    console.error('LINE Full Error: ', error);
    console.error('LINE Message :', error.response ? JSON.stringify(error.response.data) : error.message);
  }
}


function getDiscordDescription(descriptionObj, eventContent) {
  let description = ''
  for (const key of Object.keys(descriptionObj)) {
    description += `**${key}**: ${descriptionObj[key]}\n\n`
  }
  if (eventContent.commits?.length) {
    description += `**Commit**: [${eventContent.commits?.length} new commits](${eventContent.compare})\n`
    for (let i = 0; i < 5 && i < eventContent.commits.length; i++) {
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