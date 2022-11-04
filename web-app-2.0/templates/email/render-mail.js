import React, { ComponentType } from 'react';
import { renderEmail } from 'react-html-email';
import EmailLogin from './email-login';
import InviteFriend from './invite-friend';

export const renderReactEmail = (Component, data) => {
    return renderEmail(<Component {...data} />);
};

export const renderInviteFriendEmail = (props) => {
    return renderReactEmail(InviteFriend, props);
};

export const renderEmailLoginEmail = (props) => {
    return renderReactEmail(EmailLogin, props);
};