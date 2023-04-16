import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { AppContext } from '../contexts/app-context';

export default function AppTheme(props) {
  const app = React.useContext(AppContext);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: app.mode,
          primary: {
            main: '#F4CE00',
          },
          background: {
            paper: app.mode === 'dark' ? '#111921' : '#F5F5F5',
            dark: '#0F151C',
            light: '#FFFFFF',
            default: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
            main: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
            searchBar: app.mode === 'dark' ? '#19222C' : '#F5F5F5',
            userBox: app.mode === 'dark' ? '#19222C' : '#EDEFED',
          },
          profileButton: {
            main: app.mode === 'dark' ? '#253340' : '#4D5F72',
          },
          hoverPrimary: {
            main: '#FFE555',
          },
          activePrimary: {
            main: '#FFF4B8',
          },
          secondary: {
            main: '#7A55FF',
          },
          error: {
            main: '#FF8199',
          },
          text1: {
            main: '#FFFFFF',
          },
          background1: {
            main: '#0F151C',
          },
          background2: {
            main: '#19222C',
          },
          backgroundLight: {
            main: '#FFFFFF',
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
          },
          hoverTabDark: {
            main: '#151E26',
          },
          hoverTabLight: {
            main: '#F5F5F5',
          },
          hoverListDark: {
            main: '#F4CE00',
          },
          hoverListLight: {
            main: '#378CDB',
          },
          formBorder: {
            main: '#FF8199',
          },
          text: {
            main: app.mode === 'dark' ? '#FFFFFF' : '#010101',
          },
          icon: {
            main: app.mode === 'dark' ? '#4D5F72' : '#4D5F72',
            contacts: app.mode === 'dark' ? '#FFFFFF' : '#081724',
            contactsBackground: app.mode === 'dark' ? '#253340' : '#CFCFCF',
          },
          hoverTab: {
            main: '#4D5F72',
          },
          sidebar: {
            main: '#394859',
          },
        },
        typography: {
          fontFamily: 'Questrial',
          fontWeightRegular: 500,
          fontWeightBold: 700,
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
            '@media (max-width:900px)': {
              fontSize: '12px',
            },
            fontWeight: '500',
          },
          sh2: {
            fontSize: '14px',
            '@media (max-width:900px)': {
              fontSize: '10px',
            },
            fontWeight: '500',
          },
          sh3: {
            fontSize: '12px',
            fontWeight: '500',
          },
          p: {
            fontSize: '16px',
            fontWeight: 'medium',
          },
          button: {
            textTransform: 'capitalize',
            fontWeight: 'bold',
          },
          allVariants: {
            color: app.mode === 'dark' ? '#FFFFFF' : '#010101',
          },
          rep: {
            fontSize: '15px',
            '@media (max-width:900px)': {
              fontSize: '7px',
            },
            fontWeight: '500',
          },
          walletText: {
            fontSize: '12px',
            '@media (max-width:900px)': {
              fontSize: '10px',
            },
            fontWeight: '500',
          },
          mobileh1: {
            fontSize: '32px',
            '@media (max-width:900px)': {
              fontSize: '18px',
            },
            fontWeight: 'bold',
          },
          mobileh2: {
            fontSize: '16px',
            '@media (max-width:900px)': {
              fontSize: '14px',
            },
            fontWeight: 'bold',
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButtonBase: {
            defaultProps: {
              style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            },
          },
          MuiAppBar: {
            defaultProps: {
              sx: {
                backgroundColor: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
                border: 'none',
              },
              elevation: 3,
            },
            styleOverrides: {
              root: {
                backgroundColor: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
              },
            },
          },
          MuiCard: {
            defaultProps: {
              variant: 'outlined',
            },
          },
          MuiPaper: {
            defaultProps: {
              variant: 'outlined',
            },
          },
          MuiDivider: {
            defaultProps: {
              color: app.mode === 'dark' ? '#25303C' : '#E7E7E7',
            },
          },
          MuiToolbar: {
            defaultProps: {
              sx: {
                paddingTop: { xs: '15px', md: '20px' },
                paddingX: { xs: '15px', lg: '105px' },
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              autoComplete: 'off',
              sx: {
                '& label.Mui-focused': {
                  color: app.mode === 'dark' ? 'primary.main' : 'secondary.main',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: app.mode === 'dark' ? 'primary.main' : 'secondary.main',
                  },
                },
              },
            },
          },
          MuiFormControl: {
            defaultProps: {
              sx: {
                '& label.Mui-focused': {
                  color: app.mode === 'dark' ? 'primary.main' : 'secondary.main',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: app.mode === 'dark' ? 'primary.main' : 'secondary.main',
                  },
                },
              },
            },
          },
          MuiCircularProgress: {
            defaultProps: {
              color: app.mode === 'dark' ? 'primary' : 'secondary',
            },
          },
        },
        // spacing: [0, 10, 15, 20, 30, 60, 80],
        icons: {
          sizes: {
            small: 16,
            medium: 24,
            large: 32,
          },
        },
      }),
    [app.mode]
  );

  React.useEffect(() => {
    // update body background color on theme change
    document.body.style.backgroundColor =
      app.mode === 'dark' ? theme.palette.background.dark : theme.palette.background.light;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.mode]);

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
