# SendInBlue Create Contact Lambda

📨A Lambda function for creating email contacts in SendInBlue.
Perfect for landing page contact forms.

* ✅ Semantic HTTP statuses
* 💡 Checks email validity
* 🔒 CORS-ready (customizable)
* 💬 Send Slack notifications on success, duplicate, and errors
* 🚀 Build & deploy to AWS from the command line

## Usage

> Retrieve your API endpoint url from the Lambda console

`POST` the following json body to the endpoint:

```js
{
  "email": "fred@flintstone.com"
}
```

## Development

> Follow the steps outlined in the **Dev setup** section below if this is your first time.

```bash
# Start Docker 🐳 (I use Docker.app)
# Invoke the function
sam local invoke --env-vars .env.json --event events/goodEmail.json
```

## Deployment

> Follow the steps outlined in the **Deploy setup** section below if this is your first time.

```bash
./create-contact/deploy.sh 
```

## Project setup

### Dev setup

1. Install `npm`, the `AWS SAM CLI`, and Docker
2. `cd create-contact && npm i`
3. In the project root, create and populate `.env.json` with the following env vars:

```
{
  "CreateContactFunction": {
    "SENDINBLUE_API_KEY": "xkeysib-****",
    "CORS_HEADERS": "{ \"Access-Control-Allow-Origin\": \"*\" }",
    "SLACK_DEV_NOTIFICATIONS_WEBHOOK_URL": "https://hooks.slack.com/services/****/****"
  }
}
```

> The Slack webhook is optional, but you'll be glad you set it up ;)

### Deploy setup

Open the Lambda console and follow my [Lambda deployment guide](https://gist.github.com/AnalyzePlatypus/c2ae820a5ec2d2a0a92fe10212e5e72c) to setup AWS.

When you create the function, name it `SendInBlueCreateContact`

When you create the AWS CLI upload profile, name it `SendInBlueCreateContactLambdaAccess`.