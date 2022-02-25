import sdk from 'sib-api-v3-sdk';

var client = sdk.ApiClient.instance;
var apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_KEY;

export const send = async (sendToName: string, sendToEmail: string, subject: string, textContent: string, htmlContent: string) => {
    var apiInstance = new sdk.TransactionalEmailsApi();
    var sendSmtpEmail = new sdk.SendSmtpEmail();
    sendSmtpEmail = {
        sender: { name: 'GoingUP', email: 'app@goingup.xyz' },
        to: [{
            email: sendToEmail,
            name: sendToName
        }],
        subject,
        textContent,
        htmlContent
    };
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log('API called successfully. Returned data: ' + data);
        },
        function (error) {
            console.error(error);
        }
    );
};
