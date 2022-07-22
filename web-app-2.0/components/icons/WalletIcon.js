import { useTheme } from '@mui/material';

export default function WalletIcon(props) {
    const theme = useTheme();
    const size = theme.icons.sizes[props.size] || 24;

    return (
        <svg width={size} height={size} viewBox={`0 0 24 24`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.0946 3.81654C15.6116 3.75159 14.964 3.75 14 3.75H4C3.30964 3.75 2.75 4.30964 2.75 5C2.75 5.69036 3.30964 6.25 4 6.25H12H16L16.0549 6.25L16.1619 6.25H17.2482C17.244 5.68056 17.2299 5.25089 17.1835 4.90539C17.1214 4.44393 17.0142 4.24643 16.8839 4.11612C16.7536 3.9858 16.5561 3.87858 16.0946 3.81654ZM4 2.25C2.48122 2.25 1.25 3.48122 1.25 5V15V15.0549C1.24998 16.4225 1.24996 17.5248 1.36652 18.3918C1.48754 19.2919 1.74643 20.0497 2.34835 20.6517C2.95027 21.2536 3.70814 21.5125 4.60825 21.6335C5.47522 21.75 6.57754 21.75 7.94513 21.75H8H16H16.0549C17.4225 21.75 18.5248 21.75 19.3918 21.6335C20.2919 21.5125 21.0497 21.2536 21.6517 20.6517C22.2536 20.0497 22.5125 19.2919 22.6335 18.3918C22.7202 17.7469 22.7424 16.9719 22.7481 16.0544C22.7493 16.0365 22.75 16.0183 22.75 16V15.1496C22.75 15.1181 22.75 15.0866 22.75 15.0549V15V13V12.9451C22.75 12.9134 22.75 12.8819 22.75 12.8504V12C22.75 11.9817 22.7493 11.9635 22.7481 11.9456C22.7424 11.0281 22.7202 10.2531 22.6335 9.60825C22.5125 8.70814 22.2536 7.95027 21.6517 7.34835C21.0497 6.74643 20.2919 6.48754 19.3918 6.36652C19.1903 6.33943 18.9761 6.31864 18.7488 6.30268C18.7451 5.68484 18.7301 5.15172 18.6701 4.70552C18.5857 4.07773 18.4 3.51093 17.9445 3.05546C17.4891 2.59999 16.9223 2.41432 16.2945 2.32991C15.6997 2.24995 14.9505 2.24997 14.052 2.25H14H4ZM21.2389 11.25C21.2266 10.681 21.2009 10.2098 21.1469 9.80812C21.0482 9.07435 20.8678 8.68577 20.591 8.40901C20.3142 8.13225 19.9257 7.9518 19.1919 7.85315C18.4365 7.75159 17.4354 7.75 16 7.75H12H4C3.54989 7.75 3.12503 7.64186 2.75 7.45015V15C2.75 16.4354 2.75159 17.4365 2.85315 18.1919C2.9518 18.9257 3.13225 19.3142 3.40901 19.591C3.68577 19.8678 4.07435 20.0482 4.80812 20.1469C5.56347 20.2484 6.56458 20.25 8 20.25H16C17.4354 20.25 18.4365 20.2484 19.1919 20.1469C19.9257 20.0482 20.3142 19.8678 20.591 19.591C20.8678 19.3142 21.0482 18.9257 21.1469 18.1919C21.2009 17.7902 21.2266 17.319 21.2389 16.75H20C18.4812 16.75 17.25 15.5188 17.25 14C17.25 12.4812 18.4812 11.25 20 11.25H21.2389ZM21.25 15V13C21.25 12.9152 21.25 12.8318 21.25 12.75H20C19.3096 12.75 18.75 13.3096 18.75 14C18.75 14.6904 19.3096 15.25 20 15.25H21.25C21.25 15.1682 21.25 15.0848 21.25 15Z"
                fill={theme.palette.icon.main}
            />
        </svg>
    );
}
