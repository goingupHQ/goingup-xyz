import React from 'react';
import {
    Mjml,
    MjmlHead,
    MjmlTitle,
    MjmlPreview,
    MjmlBody,
    MjmlSection,
    MjmlColumn,
    MjmlButton,
    MjmlImage,
    MjmlText,
    MjmlStyle
} from 'mjml-react';

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
    padding: '0 32px',
};

const containerStyle = {
    backgroundColor: '#F5F8FA',
    width: '100%',
};

const linkStyle = {
    color: 'white',
    display: 'block',
    paddingBottom: '13px',
    paddingTop: '13px',
    textDecoration: 'none',
    width: '100%',
};

const fluidItemStyle = {
    backgroundColor: '#6e40f3',
    borderRadius: 4,
    cursor: 'pointer',
    height: 48,
    textAlign: 'center',
    textDecoration: 'none',
};

export const generate = (props) => {
    const { username, subject, confirmationUrl, personalMessage } = props;

    return (
        <Mjml>
            <MjmlHead>
                <MjmlTitle>Last Minute Offer</MjmlTitle>
                <MjmlPreview>Last Minute Offer...</MjmlPreview>
                {/* <MjmlStyle>{css}</MjmlStyle> */}
                <MjmlStyle>{`
          .blue-column {
            background-color: blue;
          }
        `}</MjmlStyle>
                <MjmlStyle inline>{`
          .red-column {
            background-color: red;
          }
        `}</MjmlStyle>
            </MjmlHead>
            <MjmlBody width={500}>
                <MjmlSection fullWidth backgroundColor="#efefef">
                    <MjmlColumn>
                        <MjmlImage src="https://static.wixstatic.com/media/5cb24728abef45dabebe7edc1d97ddd2.jpg" />
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlButton padding="20px" backgroundColor="#346DB7" href="https://www.wix.com/">
                            I like it!
                        </MjmlButton>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn cssClass="blue-column">
                        <MjmlText>I am blue</MjmlText>
                    </MjmlColumn>
                    <MjmlColumn cssClass="red-column">
                        <MjmlText>I am red</MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText>
                            <a href="/2">Open Second Template</a>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlBody>
        </Mjml>
        // <Mjml>
        //     <MjmlBody>
        //         <MjmlSection textAlign="center" style={containerStyle}>
        //             <MjmlColumn>
        //                 <MjmlImage
        //                     height="auto"
        //                     src="https://app.goingup.xyz/images/goingup-glyph.png"
        //                     style={{ margin: '0 auto ' }}
        //                     width={50}
        //                 />

        //                 <MjmlSection style={backgroundStyle}>
        //                     <MjmlColumn>
        //                         <MjmlTitle>Join us at GoingUP</MjmlTitle>

        //                         <MjmlText>
        //                             Hello, <br />
        //                             Your friend {username} is inviting you to join our Web3 networking platform. We are
        //                             looking forward to adding you to our growing network.

        //                             {personalMessage && (
        //                                 <>
        //                                     <br />
        //                                     Personal message:
        //                                     <br />
        //                                     {personalMessage}
        //                                 </>
        //                             )}
        //                         </MjmlText>

        //                         <MjmlButton style={fluidItemStyle}>
        //                             <a href={confirmationUrl} style={linkStyle}>
        //                                 Join GoingUP
        //                             </a>
        //                         </MjmlButton>
        //                     </MjmlColumn>
        //                 </MjmlSection>
        //             </MjmlColumn>
        //         </MjmlSection>
        //     </MjmlBody>
        // </Mjml>
    );
};
