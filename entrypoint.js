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
  'DISCORD_WEBHOOK'
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

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

let url;
let payload;
console.log("eventContent: ", eventContent)
if (argv._.length === 0 && !process.env.DISCORD_EMBEDS || true) {
  // If argument and embeds NOT provided, let Discord show the event informations.
  url = `${process.env.DISCORD_WEBHOOK}/github`;
  payload = JSON.stringify(JSON.parse(eventContent));
} else {
  url = process.env.DISCORD_WEBHOOK;
  payload = JSON.stringify({
    content: content,
    ...process.env.DISCORD_EMBEDS && { embeds: embedsObject },
    ...process.env.DISCORD_USERNAME && { username: process.env.DISCORD_USERNAME },
    ...process.env.DISCORD_AVATAR && { avatar_url: process.env.DISCORD_AVATAR },
  });
}

// curl -X POST -H "Content-Type: application/json" --data "$(cat $GITHUB_EVENT_PATH)" $DISCORD_WEBHOOK/github
payload = {
  "action": "completed",
  "workflow_run": {
    "id": 9537208983,
    "name": "DEV - Build",
    "node_id": "WFR_kwLOIfJNb88AAAACOHZClw",
    "head_branch": "cloud-pvt",
    "head_sha": "434ca086def83e85be8aeac44c4d1ee80ceda46a",
    "path": ".github/workflows/build-dev.yml",
    "display_title": "Edited: README.md",
    "run_number": 642,
    "event": "push",
    "status": "completed",
    "conclusion": "success",
    "workflow_id": 41247223,
    "check_suite_id": 24960175582,
    "check_suite_node_id": "CS_kwDOIfJNb88AAAAFz74N3g",
    "url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/actions/runs/9537208983",
    "html_url": "https://github.com/corp-ais/mychannel-client-suspend-reconnect/actions/runs/9537208983",
    "pull_requests": [

    ],
    "created_at": "2024-06-16T15:57:28Z",
    "updated_at": "2024-06-16T15:59:43Z",
    "actor": {
      "login": "bawop443",
      "id": 101396621,
      "node_id": "U_kgDOBgswjQ",
      "avatar_url": "https://avatars.githubusercontent.com/u/101396621?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/bawop443",
      "html_url": "https://github.com/bawop443",
      "followers_url": "https://api.github.com/users/bawop443/followers",
      "following_url": "https://api.github.com/users/bawop443/following{/other_user}",
      "gists_url": "https://api.github.com/users/bawop443/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/bawop443/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/bawop443/subscriptions",
      "organizations_url": "https://api.github.com/users/bawop443/orgs",
      "repos_url": "https://api.github.com/users/bawop443/repos",
      "events_url": "https://api.github.com/users/bawop443/events{/privacy}",
      "received_events_url": "https://api.github.com/users/bawop443/received_events",
      "type": "User",
      "site_admin": false
    },
    "run_attempt": 1,
    "referenced_workflows": [

    ],
    "run_started_at": "2024-06-16T15:57:28Z",
    "triggering_actor": {
      "login": "bawop443",
      "id": 101396621,
      "node_id": "U_kgDOBgswjQ",
      "avatar_url": "https://avatars.githubusercontent.com/u/101396621?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/bawop443",
      "html_url": "https://github.com/bawop443",
      "followers_url": "https://api.github.com/users/bawop443/followers",
      "following_url": "https://api.github.com/users/bawop443/following{/other_user}",
      "gists_url": "https://api.github.com/users/bawop443/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/bawop443/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/bawop443/subscriptions",
      "organizations_url": "https://api.github.com/users/bawop443/orgs",
      "repos_url": "https://api.github.com/users/bawop443/repos",
      "events_url": "https://api.github.com/users/bawop443/events{/privacy}",
      "received_events_url": "https://api.github.com/users/bawop443/received_events",
      "type": "User",
      "site_admin": false
    },
    "jobs_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/actions/runs/9537208983/jobs",
    "logs_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/actions/runs/9537208983/logs",
    "check_suite_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/check-suites/24960175582",
    "artifacts_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/actions/runs/9537208983/artifacts",
    "cancel_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/actions/runs/9537208983/cancel",
    "rerun_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/actions/runs/9537208983/rerun",
    "previous_attempt_url": null,
    "workflow_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/actions/workflows/41247223",
    "head_commit": {
      "id": "434ca086def83e85be8aeac44c4d1ee80ceda46a",
      "tree_id": "515ee76f385bdf8c45328750534e6b76357f5b0b",
      "message": "Edited: README.md",
      "timestamp": "2024-06-16T15:57:21Z",
      "author": {
        "name": "Bawonsak Petchbunjerdkul",
        "email": "bawonsak.p@entronica.co.th"
      },
      "committer": {
        "name": "Bawonsak Petchbunjerdkul",
        "email": "bawonsak.p@entronica.co.th"
      }
    },
    "repository": {
      "id": 569527663,
      "node_id": "R_kgDOIfJNbw",
      "name": "mychannel-client-suspend-reconnect",
      "full_name": "corp-ais/mychannel-client-suspend-reconnect",
      "private": true,
      "owner": {
        "login": "corp-ais",
        "id": 88998016,
        "node_id": "MDEyOk9yZ2FuaXphdGlvbjg4OTk4MDE2",
        "avatar_url": "https://avatars.githubusercontent.com/u/88998016?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/corp-ais",
        "html_url": "https://github.com/corp-ais",
        "followers_url": "https://api.github.com/users/corp-ais/followers",
        "following_url": "https://api.github.com/users/corp-ais/following{/other_user}",
        "gists_url": "https://api.github.com/users/corp-ais/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/corp-ais/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/corp-ais/subscriptions",
        "organizations_url": "https://api.github.com/users/corp-ais/orgs",
        "repos_url": "https://api.github.com/users/corp-ais/repos",
        "events_url": "https://api.github.com/users/corp-ais/events{/privacy}",
        "received_events_url": "https://api.github.com/users/corp-ais/received_events",
        "type": "Organization",
        "site_admin": false
      },
      "html_url": "https://github.com/corp-ais/mychannel-client-suspend-reconnect",
      "description": null,
      "fork": false,
      "url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect",
      "forks_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/forks",
      "keys_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/keys{/key_id}",
      "collaborators_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/collaborators{/collaborator}",
      "teams_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/teams",
      "hooks_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/hooks",
      "issue_events_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/issues/events{/number}",
      "events_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/events",
      "assignees_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/assignees{/user}",
      "branches_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/branches{/branch}",
      "tags_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/tags",
      "blobs_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/blobs{/sha}",
      "git_tags_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/tags{/sha}",
      "git_refs_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/refs{/sha}",
      "trees_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/trees{/sha}",
      "statuses_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/statuses/{sha}",
      "languages_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/languages",
      "stargazers_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/stargazers",
      "contributors_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/contributors",
      "subscribers_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/subscribers",
      "subscription_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/subscription",
      "commits_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/commits{/sha}",
      "git_commits_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/commits{/sha}",
      "comments_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/comments{/number}",
      "issue_comment_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/issues/comments{/number}",
      "contents_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/contents/{+path}",
      "compare_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/compare/{base}...{head}",
      "merges_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/merges",
      "archive_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/{archive_format}{/ref}",
      "downloads_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/downloads",
      "issues_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/issues{/number}",
      "pulls_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/pulls{/number}",
      "milestones_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/milestones{/number}",
      "notifications_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/notifications{?since,all,participating}",
      "labels_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/labels{/name}",
      "releases_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/releases{/id}",
      "deployments_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/deployments"
    },
    "head_repository": {
      "id": 569527663,
      "node_id": "R_kgDOIfJNbw",
      "name": "mychannel-client-suspend-reconnect",
      "full_name": "corp-ais/mychannel-client-suspend-reconnect",
      "private": true,
      "owner": {
        "login": "corp-ais",
        "id": 88998016,
        "node_id": "MDEyOk9yZ2FuaXphdGlvbjg4OTk4MDE2",
        "avatar_url": "https://avatars.githubusercontent.com/u/88998016?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/corp-ais",
        "html_url": "https://github.com/corp-ais",
        "followers_url": "https://api.github.com/users/corp-ais/followers",
        "following_url": "https://api.github.com/users/corp-ais/following{/other_user}",
        "gists_url": "https://api.github.com/users/corp-ais/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/corp-ais/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/corp-ais/subscriptions",
        "organizations_url": "https://api.github.com/users/corp-ais/orgs",
        "repos_url": "https://api.github.com/users/corp-ais/repos",
        "events_url": "https://api.github.com/users/corp-ais/events{/privacy}",
        "received_events_url": "https://api.github.com/users/corp-ais/received_events",
        "type": "Organization",
        "site_admin": false
      },
      "html_url": "https://github.com/corp-ais/mychannel-client-suspend-reconnect",
      "description": null,
      "fork": false,
      "url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect",
      "forks_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/forks",
      "keys_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/keys{/key_id}",
      "collaborators_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/collaborators{/collaborator}",
      "teams_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/teams",
      "hooks_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/hooks",
      "issue_events_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/issues/events{/number}",
      "events_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/events",
      "assignees_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/assignees{/user}",
      "branches_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/branches{/branch}",
      "tags_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/tags",
      "blobs_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/blobs{/sha}",
      "git_tags_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/tags{/sha}",
      "git_refs_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/refs{/sha}",
      "trees_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/trees{/sha}",
      "statuses_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/statuses/{sha}",
      "languages_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/languages",
      "stargazers_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/stargazers",
      "contributors_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/contributors",
      "subscribers_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/subscribers",
      "subscription_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/subscription",
      "commits_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/commits{/sha}",
      "git_commits_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/commits{/sha}",
      "comments_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/comments{/number}",
      "issue_comment_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/issues/comments{/number}",
      "contents_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/contents/{+path}",
      "compare_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/compare/{base}...{head}",
      "merges_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/merges",
      "archive_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/{archive_format}{/ref}",
      "downloads_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/downloads",
      "issues_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/issues{/number}",
      "pulls_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/pulls{/number}",
      "milestones_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/milestones{/number}",
      "notifications_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/notifications{?since,all,participating}",
      "labels_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/labels{/name}",
      "releases_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/releases{/id}",
      "deployments_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/deployments"
    }
  },
  "workflow": {
    "id": 41247223,
    "node_id": "W_kwDOIfJNb84CdWH3",
    "name": "DEV - Build",
    "path": ".github/workflows/build-dev.yml",
    "state": "active",
    "created_at": "2022-11-23T03:02:30.000Z",
    "updated_at": "2022-11-23T03:02:30.000Z",
    "url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/actions/workflows/41247223",
    "html_url": "https://github.com/corp-ais/mychannel-client-suspend-reconnect/blob/cloud-develop/.github/workflows/build-dev.yml",
    "badge_url": "https://github.com/corp-ais/mychannel-client-suspend-reconnect/workflows/DEV%20-%20Build/badge.svg"
  },
  "repository": {
    "id": 569527663,
    "node_id": "R_kgDOIfJNbw",
    "name": "mychannel-client-suspend-reconnect",
    "full_name": "corp-ais/mychannel-client-suspend-reconnect",
    "private": true,
    "owner": {
      "login": "corp-ais",
      "id": 88998016,
      "node_id": "MDEyOk9yZ2FuaXphdGlvbjg4OTk4MDE2",
      "avatar_url": "https://avatars.githubusercontent.com/u/88998016?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/corp-ais",
      "html_url": "https://github.com/corp-ais",
      "followers_url": "https://api.github.com/users/corp-ais/followers",
      "following_url": "https://api.github.com/users/corp-ais/following{/other_user}",
      "gists_url": "https://api.github.com/users/corp-ais/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/corp-ais/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/corp-ais/subscriptions",
      "organizations_url": "https://api.github.com/users/corp-ais/orgs",
      "repos_url": "https://api.github.com/users/corp-ais/repos",
      "events_url": "https://api.github.com/users/corp-ais/events{/privacy}",
      "received_events_url": "https://api.github.com/users/corp-ais/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "html_url": "https://github.com/corp-ais/mychannel-client-suspend-reconnect",
    "description": null,
    "fork": false,
    "url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect",
    "forks_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/forks",
    "keys_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/teams",
    "hooks_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/hooks",
    "issue_events_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/issues/events{/number}",
    "events_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/events",
    "assignees_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/assignees{/user}",
    "branches_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/branches{/branch}",
    "tags_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/tags",
    "blobs_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/languages",
    "stargazers_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/stargazers",
    "contributors_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/contributors",
    "subscribers_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/subscribers",
    "subscription_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/subscription",
    "commits_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/contents/{+path}",
    "compare_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/merges",
    "archive_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/downloads",
    "issues_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/issues{/number}",
    "pulls_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/labels{/name}",
    "releases_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/releases{/id}",
    "deployments_url": "https://api.github.com/repos/corp-ais/mychannel-client-suspend-reconnect/deployments",
    "created_at": "2022-11-23T02:55:53Z",
    "updated_at": "2023-05-02T02:26:04Z",
    "pushed_at": "2024-06-16T15:57:26Z",
    "git_url": "git://github.com/corp-ais/mychannel-client-suspend-reconnect.git",
    "ssh_url": "git@github.com:corp-ais/mychannel-client-suspend-reconnect.git",
    "clone_url": "https://github.com/corp-ais/mychannel-client-suspend-reconnect.git",
    "svn_url": "https://github.com/corp-ais/mychannel-client-suspend-reconnect",
    "homepage": null,
    "size": 3781,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "TypeScript",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": true,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 1,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [

    ],
    "visibility": "private",
    "forks": 0,
    "open_issues": 1,
    "watchers": 0,
    "default_branch": "cloud-develop",
    "custom_properties": {

    }
  },
  "organization": {
    "login": "corp-ais",
    "id": 88998016,
    "node_id": "MDEyOk9yZ2FuaXphdGlvbjg4OTk4MDE2",
    "url": "https://api.github.com/orgs/corp-ais",
    "repos_url": "https://api.github.com/orgs/corp-ais/repos",
    "events_url": "https://api.github.com/orgs/corp-ais/events",
    "hooks_url": "https://api.github.com/orgs/corp-ais/hooks",
    "issues_url": "https://api.github.com/orgs/corp-ais/issues",
    "members_url": "https://api.github.com/orgs/corp-ais/members{/member}",
    "public_members_url": "https://api.github.com/orgs/corp-ais/public_members{/member}",
    "avatar_url": "https://avatars.githubusercontent.com/u/88998016?v=4",
    "description": "AIS, as the digital life service provider never stops inventing and enhancing our services to serve today’s lifestyles with the technologies of tomorrow. "
  },
  "enterprise": {
    "id": 9373,
    "slug": "ais",
    "name": " AIS - Advanced Info Services",
    "node_id": "E_kgDNJJ0",
    "avatar_url": "https://avatars.githubusercontent.com/b/9373?v=4",
    "description": null,
    "website_url": null,
    "html_url": "https://github.com/enterprises/ais",
    "created_at": "2021-09-30T01:01:51Z",
    "updated_at": "2024-06-05T01:41:49Z"
  },
  "sender": {
    "login": "bawop443",
    "id": 101396621,
    "node_id": "U_kgDOBgswjQ",
    "avatar_url": "https://avatars.githubusercontent.com/u/101396621?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/bawop443",
    "html_url": "https://github.com/bawop443",
    "followers_url": "https://api.github.com/users/bawop443/followers",
    "following_url": "https://api.github.com/users/bawop443/following{/other_user}",
    "gists_url": "https://api.github.com/users/bawop443/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/bawop443/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/bawop443/subscriptions",
    "organizations_url": "https://api.github.com/users/bawop443/orgs",
    "repos_url": "https://api.github.com/users/bawop443/repos",
    "events_url": "https://api.github.com/users/bawop443/events{/privacy}",
    "received_events_url": "https://api.github.com/users/bawop443/received_events",
    "type": "User",
    "site_admin": false
  }
};
(async () => {
  console.log('Sending message ...');
  await axios.post(
    `${url}?wait=true`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-GitHub-Event': 'workflow_run',
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