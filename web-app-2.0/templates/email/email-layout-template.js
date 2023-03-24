import { Mjml, MjmlBody, MjmlColumn, MjmlHead, MjmlImage, MjmlPreview, MjmlSection, MjmlTitle } from 'mjml-react';
import React from 'react';

export default function EmailLayoutTemplate(props) {
    return (
        <Mjml>
            <MjmlHead>
                <MjmlTitle>{props.subject}</MjmlTitle>
                <MjmlPreview>{props.subject}</MjmlPreview>
            </MjmlHead>
            <MjmlBody width={500}>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlImage height="auto" src="https://app.goingup.xyz/images/goingup-glyph.png" width={50} />
                    </MjmlColumn>
                </MjmlSection>

                <MjmlSection fullWidth textAlign="center">
                    <MjmlColumn>{props.children}</MjmlColumn>
                </MjmlSection>
            </MjmlBody>
        </Mjml>
    );
}
