// Import the necessary libraries
import * as msal from "@azure/msal-browser";
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";
import { TranslatorTextClient } from "@azure/cognitiveservices-translatortext";

// Set up the MSAL configuration
const msalConfig = {
  auth: {
    clientId: "your_azure_ad_app_client_id",
    authority: "https://login.microsoftonline.com/your_tenant_id",
    redirectUri: "your_redirect_uri",
  },
};

// Create a new MSAL Public Client Application
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Attempt to acquire an access token silently
async function getAccessToken() {
  const account = msalInstance.getAllAccounts()[0];
  const request = {
    scopes: ["https://api.cognitive.microsofttranslator.com/.default"],
    account,
  };

  try {
    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    console.error("Error acquiring access token silently:", error);
    throw error;
  }
}

// Set up the Azure Translator client
async function setupTranslatorClient() {
  try {
    const accessToken = await getAccessToken();
    const creds = new CognitiveServicesCredentials(accessToken);
    const translatorClient = new TranslatorTextClient(creds, "https://api.cognitive.microsofttranslator.com");

    // Call your finishSetup() function here and pass the translatorClient
    finishSetup(translatorClient);
  } catch (error) {
    console.error("Error setting up the translator client:", error);
  }
}

// Call the setupTranslatorClient() function
setupTranslatorClient();