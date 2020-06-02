// imports

const fetch = require("node-fetch");

// env vars

const SENDINBLUE_API_KEY = process.env.SENDINBLUE_API_KEY;
const CORS_HEADERS = JSON.parse(process.env.CORS_HEADERS);
const SLACK_WEBHOOK_URL = process.env.SLACK_DEV_NOTIFICATIONS_WEBHOOK_URL;


// constants

const VALID_EMAIL_REGEX = /@/g;

const SENDINBLUE_API_ENDPOINT = 'https://api.sendinblue.com/v3/contacts';

const RESPONSES = {
  CORS_OK:{ statusCode: 200, headers: CORS_HEADERS, body: "CORS OK" },
  CONTACT_CREATED: { statusCode: 201, headers: CORS_HEADERS, body: "Success" },
  CONTACT_EXISTS: { statusCode: 202, headers: CORS_HEADERS, body: "Contact already exists" },
  MISSING_EMAIL: { statusCode: 400, headers: CORS_HEADERS, body: "Missing required body key 'email'" },
  INVALID_EMAIL: { statusCode: 422, headers: CORS_HEADERS, body: "Invalid email address" },
  MISSING_BODY: { statusCode: 400, headers: CORS_HEADERS, body: "Missing JSON body" },
}


// helpers

function createApiRequest(emailAddress) {
  return {
    method: 'POST',
    headers: {
      ...CORS_HEADERS,
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': SENDINBLUE_API_KEY
    },
    body: JSON.stringify({
      "updateEnabled": false,
      "email": emailAddress
    })
  }
}

async function sendSlackNotification(text) {
  if(SLACK_WEBHOOK_URL) {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        "text": text
      })
    })
  }
}



// Runtime

exports.lambdaHandler = async (event) => {
  if(event.httpMethod === "OPTIONS") return RESPONSES.CORS_OK;
  if(!event.body) return RESPONSES.MISSING_BODY;

  try {
      const json = JSON.parse(event.body);
      if(!json) return RESPONSES.MISSING_EMAIL;

      const emailAddress = json.email;
      console.log(`Got email ${emailAddress}`)

      if(!emailAddress) return RESPONSES.MISSING_EMAIL;
      if(!VALID_EMAIL_REGEX.test(emailAddress)) return RESPONSES.INVALID_EMAIL;

      const apiRequest = createApiRequest(emailAddress);
      const response = await fetch(SENDINBLUE_API_ENDPOINT, apiRequest);

      if(response.ok) {
        await sendSlackNotification(`✅ GrowthShake collected lead: ${emailAddress}`);
        return RESPONSES.CONTACT_CREATED;
      }

      const responseJson = await response.json()
      console.log(responseJson);

      if(responseJson.code === 'duplicate_parameter') {
        await sendSlackNotification(`ℹ️ GrowthShake collected duplicate lead: ${emailAddress}`);
        return RESPONSES.CONTACT_EXISTS;
      }
      
      throw {name: "APIResponseError", apiResponse: {
          status: response.status,
          statusText: response.statusText,
          responseText: responseText
        }
      }
    } catch (err) {
      console.error(err);
      await sendSlackNotification(`❗️GrowthShake email handler: ${JSON.stringify(err)}.\nRequest: ${apiRequest}`);
      return { 
        statusCode: 500, 
        headers: CORS_HEADERS, 
        body: err//"Internal server error"
      }
    }
};
