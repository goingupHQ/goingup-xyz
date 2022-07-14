import { createTheme, ThemeProvider } from '@mui/material';
import { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../contexts/app-context';

export default function Layout({ children }) {
    const app = useContext(AppContext);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: app.mode,
                    primary: {
                        main: '#F4CE00'
                    },
                    secondary: {
                        main: '#7A55FF'
                    }
                },
                typography: {
                    fontFamily: 'Questrial'
                }
            }),
        [app.mode]
    );

    useEffect(() => {
        document.body.style.backgroundColor =
            app.mode === 'dark' ? theme.palette.background.default : theme.palette.background.default;
    }, [app.mode]);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
