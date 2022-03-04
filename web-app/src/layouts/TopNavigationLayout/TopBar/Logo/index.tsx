import { Tooltip, styled, useTheme, useMediaQuery } from '@mui/material';
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
    const theme = useTheme();
    return (
        <LogoWrapper href="/">
            <Tooltip arrow placement="right" title="goingup.xyz">
                <>
                    {useMediaQuery(theme.breakpoints.down('sm')) &&
                    <img src="/static/images/logo/goingup-arrow.svg" style={{ height: '2.2rem' }} />
                    }

                    {useMediaQuery(theme.breakpoints.up('sm')) &&
                    <img src="/static/images/logo/goingup.svg" style={{ height: '3rem' }} />
                    }
                </>
            </Tooltip>
        </LogoWrapper>
    );
}

export default Logo;
