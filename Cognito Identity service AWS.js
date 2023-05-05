(async function () {
  const identityPoolId = "Your_IdentityPool_Id";
  const region = "Your_Region";

  // Create a CognitoIdentity service object
  const cognitoIdentity = new AWS.CognitoIdentity();

  // Get a Cognito Identity ID
  await cognitoIdentity.getId(
    {
      IdentityPoolId: identityPoolId,
    },
    async (err, data) => {
      if (err) {
        console.error("Error getting Cognito Identity ID:", err);
        return;
      }

      // Configure the Identity Pool ID and the Identity ID
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        IdentityId: data.IdentityId,
      });

      // Get the temporary AWS credentials
      await AWS.config.credentials.get((error) => {
        if (error) {
          console.error("Error getting temporary AWS credentials:", error);
        } else {
          let ep = new AWS.Endpoint(`translate.${region}.amazonaws.com`);
          window.translator = new AWS.Translate({
            endpoint: ep,
            region: AWS.config.region,
          });

          finishSetup();

          console.log(
            "Successfully authenticated as an unauthenticated user with Cognito"
          );
        }
      });
    }
  );
})();