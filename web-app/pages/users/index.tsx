import React, { useContext, useState } from 'react';
import Head from 'next/head';
import { WalletContext } from 'src/contexts/WalletContext';
import TopNavigationLayout from 'src/layouts/TopNavigationLayout';
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    styled,
    Button,
    Fade,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Backdrop,
    CircularProgress
} from '@mui/material';
import { AppContext } from '@/contexts/AppContext';
import ProfileLink from '@/components/common/ProfileLink';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const fieldStyle = {
    //m: 1
};

function Users() {
    const wallet = useContext(WalletContext);

    const [occupation, setOccupation] = useState(null);
    const [openTo, setOpenTo] = useState([]);
    const [projectGoals, setProjectGoals] = useState([]);
    const [idealCollab, setIdealCollab] = useState([]);

    const [finding, setFinding] = useState(false);

    const [foundUsers, setFoundUsers] = useState([]);

    const appContext = useContext(AppContext);
    const { availability, occupations, userGoals } = appContext;

    const findUsers = async () => {
        setFinding(true);

        try {
            const filters = [];
            if (occupation) filters.push(`occupation=${occupation}`);
            if (openTo.length) filters.push(`open_to=${openTo.join()}`);
            if (projectGoals.length)
                filters.push(`project_goals=${projectGoals.join()}`);
            if (idealCollab.length)
                filters.push(`ideal_collab=${idealCollab.join()}`);

            const response = await fetch(
                encodeURI(`/api/find-users?count=90&${filters.join('&')}`)
            );

            const users = await response.json();
            setFoundUsers(users);
        } catch (err) {
            console.log(err);
        } finally {
            setFinding(false);
        }
    };

    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <Grid
                sx={{ px: { xs: 2, md: 4 } }}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Fade in={true} timeout={1000}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: { xs: '2rem', md: '3rem' }
                            }}
                        >
                            <CardHeader
                                sx={{
                                    px: 3,
                                    pt: 3,
                                    alignItems: 'flex-start'
                                }}
                                title={
                                    <>
                                        <Typography variant="h1">
                                            Users
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Search for other users to
                                            collaborate with
                                        </Typography>
                                    </>
                                }
                            />
                            <CardContentWrapper
                                sx={{
                                    px: 3,
                                    pt: 0
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: 'autofill',
                                            md: 'repeat(2, 1fr)'
                                        }
                                    }}
                                    gap={3}
                                >
                                    <FormControl sx={fieldStyle} required>
                                        <InputLabel id="occupation-select-label">
                                            Filter By Occupation
                                        </InputLabel>
                                        <Select
                                            labelId="occupation-select-label"
                                            label="Filter By Occupation"
                                            value={occupation}
                                            onChange={(e) =>
                                                setOccupation(e.target.value)
                                            }
                                        >
                                            {occupations.map((o) => {
                                                return (
                                                    <MenuItem
                                                        key={o.id}
                                                        value={o.id}
                                                    >
                                                        {o.text}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>

                                    <FormControl sx={fieldStyle} required>
                                        <InputLabel id="availability-select-label">
                                            Filter By Availability
                                        </InputLabel>
                                        <Select
                                            labelId="availability-select-label"
                                            label="Filter By Availability"
                                            multiple
                                            value={openTo}
                                            onChange={(event) => {
                                                const {
                                                    target: { value }
                                                } = event;

                                                setOpenTo(
                                                    typeof value === 'string'
                                                        ? value.split(',')
                                                        : value
                                                );
                                            }}
                                            renderValue={(selected) =>
                                                selected
                                                    .map(
                                                        (i) =>
                                                            availability.find(
                                                                (a) =>
                                                                    a.id === i
                                                            ).text
                                                    )
                                                    .join(', ')
                                            }
                                        >
                                            {availability.map((a) => {
                                                return (
                                                    <MenuItem
                                                        key={a.id}
                                                        value={a.id}
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                openTo?.indexOf(
                                                                    a.id
                                                                ) > -1
                                                            }
                                                        />
                                                        <ListItemText
                                                            primary={a.text}
                                                        />
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>

                                    <FormControl sx={fieldStyle} required>
                                        <InputLabel id="project-goals-label">
                                            Filter By Primary Goals
                                        </InputLabel>
                                        <Select
                                            labelId="project-goals-label"
                                            value={projectGoals}
                                            label="Filter By Primary Goals"
                                            multiple
                                            onChange={(event) => {
                                                const {
                                                    target: { value }
                                                } = event;

                                                setProjectGoals(
                                                    typeof value === 'string'
                                                        ? value.split(',')
                                                        : value
                                                );
                                            }}
                                            renderValue={(selected) =>
                                                selected
                                                    .map(
                                                        (i) =>
                                                            userGoals.find(
                                                                (ug) =>
                                                                    ug.id === i
                                                            ).text
                                                    )
                                                    .join(', ')
                                            }
                                        >
                                            {userGoals.map((ug) => {
                                                return (
                                                    <MenuItem
                                                        key={ug.id}
                                                        value={ug.id}
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                projectGoals?.indexOf(
                                                                    ug.id
                                                                ) > -1
                                                            }
                                                        />
                                                        <ListItemText
                                                            primary={ug.text}
                                                        />
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>

                                    <FormControl sx={fieldStyle} required>
                                        <InputLabel id="ideal-collaborator-label">
                                            Filter By Ideal Collaborators
                                        </InputLabel>
                                        <Select
                                            labelId="ideal-collaborator-label"
                                            value={idealCollab}
                                            label="Filter By Ideal Collaborators"
                                            multiple
                                            onChange={(event) => {
                                                const {
                                                    target: { value }
                                                } = event;

                                                setIdealCollab(
                                                    typeof value === 'string'
                                                        ? value.split(',')
                                                        : value
                                                );
                                            }}
                                            renderValue={(selected) =>
                                                selected
                                                    .map(
                                                        (i) =>
                                                            occupations.find(
                                                                (ug) =>
                                                                    ug.id === i
                                                            ).text
                                                    )
                                                    .join(', ')
                                            }
                                        >
                                            {occupations.map((o) => {
                                                return (
                                                    <MenuItem
                                                        key={o.id}
                                                        value={o.id}
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                idealCollab?.indexOf(
                                                                    o.id
                                                                ) > -1
                                                            }
                                                        />
                                                        <ListItemText
                                                            primary={o.text}
                                                        />
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Button
                                    variant="contained"
                                    sx={{ marginTop: 3 }}
                                    onClick={findUsers}
                                >
                                    Find Users
                                </Button>

                                <Grid container spacing={3} sx={{ marginTop: 3}}>
                                    {foundUsers.map((item) => {
                                        return (
                                            <Grid
                                                key={item.address}
                                                item
                                                xs={6}
                                                md={3}
                                                lg={2}
                                                sx={{ textAlign: 'center' }}
                                            >
                                                <ProfileLink profile={item} />
                                            </Grid>
                                        );
                                    })}
                                </Grid>

                                <Backdrop open={finding}>
                                    <CircularProgress />
                                </Backdrop>
                            </CardContentWrapper>
                        </Card>
                    </Fade>
                </Grid>
            </Grid>
        </>
    );
}

Users.getLayout = (page) => <TopNavigationLayout>{page}</TopNavigationLayout>;
export default Users;
