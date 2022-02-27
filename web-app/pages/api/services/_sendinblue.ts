import sdk from 'sib-api-v3-sdk';

var client = sdk.ApiClient.instance;
var apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_KEY;

export const sendEmail = async (sendToName: string, sendToEmail: string, subject: string, textContent: string, htmlContent: string) => {
    var apiInstance = new sdk.TransactionalEmailsApi();
    var email = new sdk.SendSmtpEmail();
    email = {
        sender: { name: 'GoingUP', email: 'app@goingup.xyz' },
        to: [{
            email: sendToEmail,
        }],
        subject
    };

    if (sendToName) email.to[0].name = sendToName;
    if (textContent) email.textContent = textContent;
    if (htmlContent) email.htmlContent = htmlContent;

    apiInstance.sendTransacEmail(email).then(
        function (data) {
            console.log('API called successfully. Returned data: ' + data);
        },
        function (error) {
            console.error(error);
        }
    );
};
