import { useTheme } from '@mui/material';

export default function MenuIcon(props) {
    const theme = useTheme();
    const size = theme.icons.sizes[props.size] || 24;
    return (
        <svg width={size} height={size} viewBox={`0 0 24 24`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.25 7C3.25 6.58579 3.58579 6.25 4 6.25H20C20.4142 6.25 20.75 6.58579 20.75 7C20.75 7.41421 20.4142 7.75 20 7.75H4C3.58579 7.75 3.25 7.41421 3.25 7ZM3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12ZM4 16.25C3.58579 16.25 3.25 16.5858 3.25 17C3.25 17.4142 3.58579 17.75 4 17.75H20C20.4142 17.75 20.75 17.4142 20.75 17C20.75 16.5858 20.4142 16.25 20 16.25H4Z"
                fill={theme.palette.icon.main}
            />
        </svg>
    );
}