import { createTheme, ThemeProvider } from '@mui/material';
import { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../contexts/app-context';

export default function Layout({ children }) {
    const lightTheme = createTheme({
        palette: {},
    });

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });


    const app = useContext(AppContext);
    console.log(app.mode);

    const theme = useMemo(() => app.mode === 'dark' ? darkTheme : lightTheme, [app.mode]);
    useEffect(() => {
        document.body.style.backgroundColor =
            app.mode === 'dark' ? darkTheme.palette.background.default : lightTheme.palette.background.default;
    }, [app.mode]);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
