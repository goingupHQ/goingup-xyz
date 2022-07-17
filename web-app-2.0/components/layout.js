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
            main: '#F4CE00',
          },
          secondary: {
            main: '#7A55FF',
          },
          text1: {
            main: '#FFFFFF',
          },
          text1: {
            main: '#4D5F72',
          },
          background1: {
            main: '#0F151C',
          },
          background2: {
            main: '#19222C',
          },
          hoverAward: {
            main: '#FFE555',
          },
          activeAward: {
            main: '#FFF4B8',
          },
          hoverFollow: {
            main: '#5537C3',
            text: '#F4CE00',
          },
          activeFollow: {
            main: '#3AB795',
            text: '#FFFFFF',
          },
          hoverViewAllProjects: {
            main: '#F4CE00',
          },
          activeViewAllProjects: {
            main: '#D2B200',
          }
        },
        typography: {
          fontFamily: 'Questrial',
          h1: {
            fontSize: '32px',
            fontWeight: 'bold',
          },
          h2: {
            fontSize: '24px',
            fontWeight: 'bold',
          },
          h3: {
            fontSize: '18px',
            fontWeight: 'bold',
          },
          sh1: {
            fontSize: '16px',
            fontWeight: '500',
            color: '#4D5F72',
          },
          sh2: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#4D5F72',
          },
          sh3: {
            fontSize: '12px',
            fontWeight: '500',
            color: '#4D5F72',
          },
          p: {
            fontSize: '16px',
            fontWeight: 'medium',
          },
        },
        spacing: [0, 10, 15, 20, 30, 60, 80],
      }),
    [app.mode]
  );

  useEffect(() => {
    document.body.style.backgroundColor =
      app.mode === 'dark'
        ? theme.palette.background.default
        : theme.palette.background.default;
  }, [app.mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
