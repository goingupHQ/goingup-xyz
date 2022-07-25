import { useTheme } from '@mui/material';

export default function SearchIcon(props) {
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
        <svg width={size} height={size} viewBox={`0 0 24 24`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.75 11C3.75 6.99594 6.99594 3.75 11 3.75C15.0041 3.75 18.25 6.99594 18.25 11C18.25 15.0041 15.0041 18.25 11 18.25C6.99594 18.25 3.75 15.0041 3.75 11ZM11 2.25C6.16751 2.25 2.25 6.16751 2.25 11C2.25 15.8325 6.16751 19.75 11 19.75C13.1462 19.75 15.112 18.9773 16.6342 17.6949L19.4697 20.5303C19.7626 20.8232 20.2374 20.8232 20.5303 20.5303C20.8232 20.2374 20.8232 19.7626 20.5303 19.4697L17.6949 16.6342C18.9773 15.112 19.75 13.1462 19.75 11C19.75 6.16751 15.8325 2.25 11 2.25Z"
                fill={color || theme.palette.icon.main}
            />
        </svg>
    );
}
