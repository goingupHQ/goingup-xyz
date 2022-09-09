import { Backdrop, Paper, TextField, Tooltip, Typography } from '@mui/material';
import React, { forwardRef, useImperativeHandle } from 'react';
import { WalletContext } from '../../contexts/wallet-context';
import debounce from 'lodash.debounce';
import { ethers } from 'ethers';
import { QrReader } from 'react-qr-reader';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';

function AddressInput(props, ref) {
    const { sx, label, value, onChange, setValue, size, autoFocus, fullWidth } = props;
    const wallet = React.useContext(WalletContext);

    const [invalidAddress, setInvalidAddress] = React.useState(false);
    const [scanningQr, setScanningQr] = React.useState(false);

    const inputRef = React.useRef(null);

    useImperativeHandle(ref, () => ({
        focus() {
            inputRef.current.focus();
        }
    }));

    const addressChangeHandler = (event) => {
        const address = event.target.value;
    };

    const debouncedChangeHandler = React.useMemo(() => debounce(addressChangeHandler, 500), []);
    const mainnetProvider = ethers.getDefaultProvider('homestead');

    return (
        <>
            <TextField
                ref={inputRef}
                label={label || 'Address'}
                variant="outlined"
                autoFocus={autoFocus}
                autoComplete="off"
                sx={sx}
                size={size}
                fullWidth
                placeholder="markibanez.eth or 0x68D99e952cF3D4faAa6411C1953979F54552A8F7"
                color={invalidAddress ? 'error' : 'primary'}
                value={value}
                onChange={e => {
                    setValue(e.target.value)
                }}
                onBlur={async () => {
                    setInvalidAddress(false);
                    if (value) {
                        if (!ethers.utils.isAddress(value)) {
                            const address = await wallet.mainnetENSProvider.resolveName(value);
                            console.log(address);
                            if (!address) setInvalidAddress(true);
                            else setValue(address);
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

export default forwardRef(AddressInput);