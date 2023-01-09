import { CircularProgress, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import { useContext, useRef, useState } from "react";
import { WalletContext } from "../../../contexts/wallet-context";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { v4 as uuid } from 'uuid';

const UploadProfilePhoto = (props) => {
    const { account } = props;
    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();
    const myAccount = wallet.address === account.address;

    const [uploadingProfile, setUploadingProfile] = useState(false);
    const uploadProfileInputRef = useRef('null');

    const uploadPhoto = async (e, photoType) => {
        if (photoType === 'cover-photo') setUploadingCover(true);
        if (photoType === 'profile-photo') setUploadingProfile(true);

        try {
            const file = e.target.files[0];
            // const filename = encodeURIComponent(file.name);
            const filename = uuid();
            const res = await fetch(`/api/upload-to-gcp?file=${filename}`);
            const { url, fields } = await res.json();
            const formData = new FormData();

            Object.entries({ ...fields, file }).forEach(([key, value]) => {
                // @ts-ignore
                formData.append(key, value);
            });

            const { address, ethersSigner } = wallet;
            const message = 'update-account';
            const signature = await wallet.signMessage(message);

            const upload = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (upload.ok) {
                console.log(
                    `Uploaded successfully to ${upload.url}${filename}`,
                    photoType
                );

                let account = {};
                if (photoType === 'cover-photo')
                    account.coverPhoto = `${upload.url}${filename}`;
                if (photoType === 'profile-photo')
                    account.profilePhoto = `${upload.url}${filename}`;

                const response = await fetch('/api/update-account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        address,
                        signature,
                        account,
                    }),
                });

                if (response.status === 200) {
                    props.refresh();
                    const msg =
                        photoType === 'cover-photo'
                            ? 'Cover photo uploaded'
                            : 'Profile photo uploaded';
                    enqueueSnackbar(msg, { variant: 'success' });
                }
            } else {
                throw 'Upload failed.';
            }
        } catch (err) {
            const msg = `Could not upload your ${
                photoType === 'cover-photo' ? 'cover' : 'profile'
            } photo`;
            enqueueSnackbar('Could not upload your cover photo', {
                variant: 'error',
            });
            console.log(err);
        } finally {
            if (photoType === 'cover-photo') {
                setUploadingCover(false);
                uploadCoverInputRef.current.value = '';
            }

            if (photoType === 'profile-photo') {
                setUploadingProfile(false);
                uploadProfileInputRef.current.value = '';
            }
        }
    };

    return (
        <>
            {myAccount && (
                <>
                    <input
                        ref={uploadProfileInputRef}
                        accept='image/*'
                        id='contained-button-file'
                        type='file'
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            uploadPhoto(e, 'profile-photo');
                        }}
                    />
                    <IconButton
                        disabled={uploadingProfile}
                        color='success'
                        sx={{
                            position: 'absolute',
                            left: { xs: 70, md: 180 },
                            top: { xs: 165, md: 190 },
                        }}
                        onClick={() => {
                            uploadProfileInputRef.current.click();
                        }}>
                        {uploadingProfile && <CircularProgress size='20px' />}
                        {!uploadingProfile && <FileUploadIcon />}
                    </IconButton>
                </>
            )}
        </>
    );
};

export default UploadProfilePhoto;
