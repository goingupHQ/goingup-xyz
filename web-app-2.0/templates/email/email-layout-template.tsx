import { Mjml, MjmlBody, MjmlColumn, MjmlHead, MjmlImage, MjmlPreview, MjmlSection, MjmlTitle } from 'mjml-react';

type EmailLayoutTemplateProps = {
  subject: string;
  children: React.ReactNode;
};

const EmailLayoutTemplate = (props: EmailLayoutTemplateProps) => {
  return (
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{props.subject}</MjmlTitle>
        <MjmlPreview>{props.subject}</MjmlPreview>
      </MjmlHead>
      <MjmlBody width={500}>
        <MjmlSection>
          <MjmlColumn>
            <MjmlImage
              height="auto"
              src="https://app.goingup.xyz/images/goingup-glyph.png"
              width={50}
            />
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection
          fullWidth
          textAlign="center"
        >
          <MjmlColumn>{props.children}</MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  )
}

export default EmailLayoutTemplate;