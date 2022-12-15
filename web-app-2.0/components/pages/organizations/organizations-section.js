import { useRouter } from "next/router";
import { useContext } from "react";
import { AppContext } from "../../../contexts/app-context";
import { OrganizationsContext } from "../../../contexts/organizations-context";

export default function OrganizationsSection() {
    const app = useContext(AppContext);
    const org = useContext(OrganizationsContext);
    const router = useRouter();

    return (
        <>
            {org.organizations.map((organization) => (
                <Box
                    key={organization.address}
                    sx={{
                        display: 'inline-block',
                        width: { xs: '100%', md: '300px' },
                        height: '300px',
                        borderRadius: '10px',
                        margin: { xs: '10px 0', md: '10px 10px' },
                        backgroundColor:
                            app.mode === 'dark' ? '#111921' : '#F5F5F5',
                        borderRadius: '8px',
                        padding: '15px',
                    }}>
                    <img
                        src={organization.logo}
                        alt={organization.name}
                        style={{ width: '200px', height: '140px' }}
                    />

                    <Typography variant='h3'>
                        {organization.description}
                    </Typography>
                    <Stack
                        direction='row'
                        alignItems='center'
                        marginTop={4}
                        spacing={2}>
                        <Button
                            variant='contained'
                            color='secondary'
                            onClick={() => {
                                router.push(
                                    `/organizations/${organization.address}`
                                );
                            }}>
                            Protocol
                        </Button>
                        <Button variant='contained' color='secondary'>
                            Identity
                        </Button>
                    </Stack>
                </Box>
            ))}
        </>
    );
}
