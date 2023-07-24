import sdk from 'sib-api-v3-sdk';

var client = sdk.ApiClient.instance;
var apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_KEY;

export const sendEmail = async (
  sendToName: string | null,
  sendToEmail: string,
  subject: string,
  textContent: string | null,
  htmlContent: string | null
) => {
  var apiInstance = new sdk.TransactionalEmailsApi();
  var email = new sdk.SendSmtpEmail();
  email = {
    sender: { name: 'GoingUP', email: 'noreply@goingup.xyz' },
    to: [
      {
        email: sendToEmail,
      },
    ],
    subject,
  };

  if (sendToName) email.to[0].name = sendToName;
  if (textContent) email.textContent = textContent;
  if (htmlContent) email.htmlContent = htmlContent;

  const result = await apiInstance.sendTransacEmail(email);
  console.log('sendEmail result', result);
};
