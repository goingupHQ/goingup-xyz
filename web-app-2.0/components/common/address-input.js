import { Backdrop, Paper, TextField, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { WalletContext } from '../../contexts/wallet-context';
import debounce from 'lodash.debounce';
import { ethers } from 'ethers';
import { QrReader } from 'react-qr-reader';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';

export default function AddressInput(props) {
    const { sx, label, value, onChange, setValue } = props;
    const wallet = React.useContext(WalletContext);

    const [invalidAddress, setInvalidAddress] = React.useState(false);
    const [scanningQr, setScanningQr] = React.useState(false);

    const inputRef = React.useRef(null);

    const addressChangeHandler = (event) => {
        const address = event.target.value;
    };

    const debouncedChangeHandler = React.useMemo(() => debounce(addressChangeHandler, 500), []);

    return (
        <>
            <TextField
                ref={inputRef}
                label={label || 'Address'}
                variant="outlined"
                sx={sx}
                placeholder="markibanez.eth or 0x68D99e952cF3D4faAa6411C1953979F54552A8F7"
                color={invalidAddress ? 'error' : 'primary'}
                value={value}
                onChange={onChange}
                onBlur={async () => {
                    setInvalidAddress(false);
                    if (value) {
                        if (!ethers.utils.isAddress(value)) {
                            const address = await wallet.mainnetENSProvider.resolveName(value);
                            if (!address) setInvalidAddress(true);
                        }
                    }
                }}
                // InputLabelProps = {{
                //     shrink: true
                // }}
                // InputProps={{
                //     endAdornment: (
                //         <Tooltip title="Scan QR Code">
                //             <QrCodeScannerOutlinedIcon
                //                 sx={{ cursor: 'pointer' }}
                //                 onClick={() => setScanningQr(true)}
                //             />
                //         </Tooltip>
                //     ),
                // }}
            />
            {invalidAddress && (
                <>
                    <br />
                    <Typography variant="caption" color="error">
                        Invalid Address
                    </Typography>
                </>
            )}

            {/* <Backdrop open={scanningQr} sx={{ zIndex: 1200 }}>
                <Paper sx={{ p: 1 }}>
                    {scanningQr &&
                    <>
                        <QrReader
                            videoId="qr-video"
                            onResult={(result, error) => {
                                if (result) {
                                    console.log(result);
                                    setValue(result?.text.replace(`ethereum:`).replace(`@1`));
                                    setScanningQr(false);
                                }

                                if (error) {
                                    console.info(error);
                                }
                            }}
                            style={{ width: '100%' }}
                        />
                        <video id="qr-video" style={{ width: '100%' }} />
                    </>
                    }
                </Paper>
            </Backdrop> */}
        </>
    );
}
