import React from 'react';
import {
    MjmlText,
} from 'mjml-react';
import EmailLayoutTemplate from './email-layout-template';

export const generate = (props) => {
    const { code } = props;

    return (
        <EmailLayoutTemplate subject="Human Council Login Code">
            <MjmlText fontSize="14px">
                GoingUP Wallet Verification Code
            </MjmlText>
            <MjmlText fontSize="14px">
                Hello, <br />
                <br />
                Below is your verification code. Please copy your code and paste it into the app to complete the GoingUP onboarding process.
                <br />
                <br />
                {code}
            </MjmlText>
        </EmailLayoutTemplate>
    );
};
