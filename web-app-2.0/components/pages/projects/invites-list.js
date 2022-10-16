import React from "react";
import { Grid, Stack, Typography, Box } from "@mui/material";
import InviteCard from "./invite-card";
import { ProjectsContext } from "../../../contexts/projects-context";
import LoadingIllustration from "../../common/loading-illustration";
import { WalletContext } from "../../../contexts/wallet-context";

export default function InvitesList(props) {
    const { projectId } = props;

    const wallet = React.useContext(WalletContext);
    const projectCtx = React.useContext(ProjectsContext);
    const [loading, setLoading] = React.useState(true);
    const [pendingInvites, setPendingInvites] = React.useState([]);
    const [ownerAddress, setOwnerAddress] = React.useState(false);

    const load = async () => {
        setLoading(true);
        try {
            setPendingInvites(await projectCtx.getPendingInvites(projectId));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const getProjectOwner = async () => {
        const getOwner = await projectCtx.getProject(projectId);
        setOwnerAddress(getOwner.owner === wallet.address);
    };

    React.useEffect(() => {
        if (projectId && wallet.address) {
            load();
            getProjectOwner();
        }
    }, [projectId, wallet.address]);

    return (
        <>
            {loading && <LoadingIllustration />}

            {!loading && (
                <>
                    {pendingInvites.length === 0 && (
                        <Stack
                            direction='column'
                            spacing={4}
                            alignItems='center'
                        >
                            <Typography variant='h2'>
                                No pending invitations
                            </Typography>
                            <Box
                                component='img'
                                src='/images/illustrations/invites.svg'
                                sx={{ width: "100%", maxWidth: { xs: 500 } }}
                            />
                            <Typography variant='body1'>
                                Invite members to your project
                            </Typography>
                        </Stack>
                    )}

                    {pendingInvites.length > 0 && (
                        <>
                            <Typography variant='h6' sx={{ mb: 3 }}>
                                {pendingInvites.length} Pending Invitation
                                {pendingInvites.length != 1 ? "s" : ""}
                            </Typography>
                            {ownerAddress && (
                                <Grid container spacing={3}>
                                    {pendingInvites.map((memberRecordId) => (
                                        <Grid
                                            item
                                            xs={12}
                                            md={6}
                                            lg={4}
                                            key={memberRecordId}
                                        >
                                            <InviteCard
                                                projectId={projectId}
                                                memberRecordId={memberRecordId}
                                                reload={load}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}
