import React from 'react';
import { A, Box, Email, Item, Image, Span } from 'react-html-email';

const emailHeadCSS = `
  body {
    background-color: #F5F8FA;
  }
`.trim();

const backgroundStyle = {
    WebkitBoxShadow: '6px 6px 40px 3px rgba(140, 152, 164, 0.2)',
    backgroundColor: '#FFF',
    borderRadius: 7,
    boxShadow: '6px 6px 40px 3px rgba(140, 152, 164, 0.2)',
    margin: '0 auto',
    width: '100%',
    padding: '0 32px'
};

const containerStyle = {
    backgroundColor: '#F5F8FA',
    width: '100%'
};

const linkStyle = {
    color: 'white',
    display: 'block',
    paddingBottom: '13px',
    paddingTop: '13px',
    textDecoration: 'none',
    width: '100%'
};

const fluidItemStyle = {
    backgroundColor: '#6e40f3',
    borderRadius: 4,
    cursor: 'pointer',
    height: 48,
    textAlign: 'center',
    textDecoration: 'none'
};

const InviteFriend = (props) =>
{
    const { username, subject, confirmationUrl, personalMessage } = props;

    return (
        <Box align="center" style={containerStyle}>
            <Email align="center" headCSS={emailHeadCSS} title={subject}>
                <Item style={{ height: 45 }} />
                <Item>
                    <Image
                        height="auto"
                        src="https://app.goingup.xyz/static/images/logo/goingup.png"
                        style={{ margin: '0 auto ' }}
                        width={400}
                    />
                </Item>
                <Item style={{ height: 30 }} />
                <Item align="center">
                    <Box style={backgroundStyle}>
                        <Item style={{ height: 40 }} />
                        <Item>
                            <Span fontSize={22} fontWeight="bold">
                                Join us at GoingUP
                            </Span>
                        </Item>
                        <Item style={{ height: 25 }} />
                        <Item style={{ color: '#000' }}>
                            Hello,
                        </Item>
                        <Item style={{ height: 25 }} />
                        <Item style={{ color: '#000' }}>
                            Your friend {username} is inviting you to join our Web3 networking platform. We are looking forward to adding you to our growing network.
                        </Item>

                        {personalMessage &&
                        <>
                            <Item style={{ height: 25 }} />
                            <Item style={{ color: '#000' }}>
                                Personal message: {personalMessage}
                            </Item>
                        </>
                        }

                        <Item style={{ height: 50 }} />
                        <Item className="button" style={fluidItemStyle}>
                            <A href={confirmationUrl} style={linkStyle}>
                                Join GoingUP
                            </A>
                        </Item>
                        <Item style={{ height: 35 }} />
                    </Box>
                </Item>
            </Email>
        </Box>
    );
}

export default InviteFriend;
