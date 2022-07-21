import { useTheme } from '@mui/material';

export default function UserIcon(props) {
    const theme = useTheme();
    const size = theme.icons.sizes[props.size] || 24;

    return (
        <svg width={size} height={size} viewBox={`0 0 24 24`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.75 7C8.75 5.20507 10.2051 3.75 12 3.75C13.7949 3.75 15.25 5.20507 15.25 7C15.25 8.79493 13.7949 10.25 12 10.25C10.2051 10.25 8.75 8.79493 8.75 7ZM12 2.25C9.37665 2.25 7.25 4.37665 7.25 7C7.25 9.62335 9.37665 11.75 12 11.75C14.6234 11.75 16.75 9.62335 16.75 7C16.75 4.37665 14.6234 2.25 12 2.25ZM5.75 19C5.75 17.2051 7.20507 15.75 9 15.75H15C16.7949 15.75 18.25 17.2051 18.25 19C18.25 19.6904 17.6904 20.25 17 20.25H7C6.30964 20.25 5.75 19.6904 5.75 19ZM9 14.25C6.37665 14.25 4.25 16.3766 4.25 19C4.25 20.5188 5.48122 21.75 7 21.75H17C18.5188 21.75 19.75 20.5188 19.75 19C19.75 16.3766 17.6234 14.25 15 14.25H9Z"
                fill={theme.palette.icon.main}
            />
        </svg>
    );
}
