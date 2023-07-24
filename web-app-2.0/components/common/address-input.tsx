import {
  Avatar,
  Backdrop,
  CircularProgress,
  Grid,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  SxProps,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import React, { forwardRef, useImperativeHandle } from 'react';
import { WalletContext } from '../../contexts/wallet-context';
import debounce from 'lodash.debounce';
import { ethers } from 'ethers';
import Identicon from './Identicon';
import { trpc } from '@/utils/trpc';
import { AddressOrAccountSearchResult } from '@/types/account';

type AddressInputProps = {
  sx?: SxProps<Theme> | undefined;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  setValue: (value: string) => void;
  size?: 'small' | 'medium';
  autoFocus?: boolean;
  fullWidth?: boolean;
};

function AddressInput({ sx, label, value, onChange, setValue, size, autoFocus, fullWidth }: AddressInputProps, ref) {
  const wallet = React.useContext(WalletContext);

  const [scanningQr, setScanningQr] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }));

  const [anchorEl, setAnchorEl] = React.useState<HTMLInputElement | null>(null);
  const showResults = Boolean(anchorEl);
  const handleShowResults = () => {
    setAnchorEl(inputRef.current);
  };

  const closeResults = () => {
    setAnchorEl(null);
  };

  const [searchResults, setSearchResults] = React.useState<AddressOrAccountSearchResult[]>([]);
  const { mutateAsync: searchWithEns, isLoading: searching } = trpc.accounts.searchWithEns.useMutation();
  const checkNonAddress = React.useMemo(
    () =>
      debounce(async (value) => {
        if (!value) return;
        const results = await searchWithEns({ query: value });
        setSearchResults(results);
        handleShowResults();
      }, 750),
    []
  );

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
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          setValue(value);

          if (!ethers.utils.isAddress(value)) checkNonAddress(value);
        }}
        // InputLabelProps = {{
        //     shrink: true
        // }}
        InputProps={{
          endAdornment: (
            <>
              {searching && <CircularProgress size={14} />}

              {/* <Tooltip title="Scan QR Code">
                            <QrCodeScannerOutlinedIcon
                                sx={{ cursor: 'pointer' }}
                                onClick={() => setScanningQr(true)}
                            />
                        </Tooltip> */}
            </>
          ),
        }}
      />

      <Popover
        open={showResults}
        anchorEl={anchorEl}
        onClose={closeResults}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Paper
          sx={{ width: anchorEl ? anchorEl.clientWidth : 300 }}
          elevation={4}
        >
          <MenuList>
            {searchResults.map((result, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  setValue(result.address);
                  closeResults();
                }}
              >
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                >
                  <Grid item>
                    {result.profilePhoto ? (
                      <Avatar src={result.profilePhoto} />
                    ) : (
                      <Identicon
                        address={result.address}
                        size={32}
                      />
                    )}
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">{result.name}</Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >
                      {result.address}
                    </Typography>
                  </Grid>
                </Grid>
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </Popover>

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
