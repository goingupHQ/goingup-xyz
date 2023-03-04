import React from 'react';
import {
    MjmlButton,
    MjmlText,
} from 'mjml-react';
import EmailLayoutTemplate from './email-layout-template';

export const generate = (props) => {
    const { username, subject, confirmationUrl, personalMessage } = props;

    return (
        <EmailLayoutTemplate subject={subject}>
            <MjmlText fontSize="14px">
                Hello, <br />
                <br />
                Your friend {username} is inviting you to join our Web3 community.
                <br />
                <br />
                Personal message:
                <br />
                <br />
                {personalMessage}
            </MjmlText>

            <MjmlButton href={confirmationUrl}>Join GoingUP</MjmlButton>
        </EmailLayoutTemplate>
    );
};
