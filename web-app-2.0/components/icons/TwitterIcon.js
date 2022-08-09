import { useTheme } from '@mui/material';

export default function TwitterIcon(props) {
    const theme = useTheme();
    const size = theme.icons.sizes[props.size] || 24;
    let color;
    if (props.color === 'primary') {
        color = theme.palette.primary.main;
    } else if (props.color === 'secondary') {
        color = theme.palette.secondary.main;
    } else {
        color = props.color
    }
    return (
        <svg
            width='28'
            height='28'
            viewBox='0 0 28 28'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <rect width='28' height='28' rx='4' fill={color || theme.palette.icon.contactsBackground} />
            <path
                d='M20.3622 10.7359C20.3718 10.8767 20.3718 11.0182 20.3718 11.1602C20.3718 15.4981 17.0694 20.5004 11.0317 20.5004V20.4978C9.24794 20.5002 7.50122 19.9892 6 19.0259C6.25934 19.0569 6.52025 19.0727 6.78144 19.0732C8.25987 19.0747 9.69581 18.5788 10.8582 17.6652C9.45381 17.6389 8.22141 16.7228 7.79137 15.3856C8.28328 15.4803 8.79034 15.461 9.27362 15.3292C7.74194 15.0198 6.64044 13.6739 6.64003 12.1113C6.64003 12.0972 6.64003 12.0832 6.64003 12.0697C7.09653 12.3242 7.60753 12.4651 8.12997 12.4806C6.68734 11.5173 6.24231 9.59843 7.11359 8.09849C8.78047 10.1493 11.2396 11.3959 13.879 11.5283C13.6144 10.3883 13.9762 9.19355 14.8287 8.3918C16.1506 7.14861 18.2301 7.21243 19.4732 8.53436C20.2084 8.38939 20.9133 8.11993 21.5577 7.73755C21.3127 8.49774 20.7998 9.14299 20.1145 9.55324C20.7653 9.47633 21.4008 9.30224 22 9.03677C21.5593 9.69586 21.0047 10.2712 20.3622 10.7359Z'
                fill={color || theme.palette.icon.contacts}
            />
        </svg>
    );
}
