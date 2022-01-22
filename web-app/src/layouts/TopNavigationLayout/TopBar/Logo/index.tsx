import { Box, Tooltip, styled } from '@mui/material';
import Link from 'src/components/Link';

const LogoWrapper = styled(Link)(
    ({ theme }) => `
        color: ${theme.colors.alpha.trueWhite[100]};
        padding: 0;
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

function Logo() {
    return (
        <LogoWrapper href="/">
            <Tooltip arrow placement="right" title="goingup.xyz">
                <img src="/static/images/logo/goingup.svg" style={{ height: '3rem' }} />
            </Tooltip>
        </LogoWrapper>
    );
}

export default Logo;
