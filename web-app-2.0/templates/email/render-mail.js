import React, { ComponentType } from 'react';
import { renderEmail } from 'react-html-email';
import EmailWalletLogin from './email-wallet-login';
import InviteFriend from './invite-friend';

export const renderReactEmail = (Component, data) => {
    return renderEmail(<Component {...data} />);
};

export const renderInviteFriendEmail = (props) => {
    return renderReactEmail(InviteFriend, props);
};

export const renderEmailWalletLoginEmail = (props) => {
    return renderReactEmail(EmailWalletLogin, props);
};