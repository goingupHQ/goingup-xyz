import { useTheme } from '@mui/material';

export default function MoonIcon(props) {
    const theme = useTheme();
    const size = theme.icons.sizes[props.size] || 24;
    let color;
    if (props.color === 'primary') {
        color = theme.palette.primary.main;
    } else if (props.color === 'secondary') {
        color = theme.palette.secondary.main;
    } else {
        color = props.color;
    }

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.3264 1.71835C11.4807 1.98285 11.4588 2.31462 11.2709 2.55645C10.3174 3.78389 9.75 5.32464 9.75 7.00002C9.75 11.0041 12.9959 14.25 17 14.25C18.1022 14.25 19.1449 14.0046 20.0784 13.5661C20.3558 13.4358 20.6845 13.4874 20.9087 13.6963C21.1328 13.9053 21.2073 14.2296 21.0968 14.5154C19.6868 18.1618 16.1466 20.75 12 20.75C6.61522 20.75 2.25 16.3848 2.25 11C2.25 6.10089 5.86263 2.04685 10.5694 1.35433C10.8724 1.30975 11.1721 1.45385 11.3264 1.71835ZM9.07683 3.28266C5.96346 4.46256 3.75 7.47328 3.75 11C3.75 15.5564 7.44365 19.25 12 19.25C14.8756 19.25 17.4088 17.7786 18.8857 15.5462C18.278 15.6797 17.647 15.75 17 15.75C12.1675 15.75 8.25 11.8325 8.25 7.00002C8.25 5.67143 8.54651 4.41117 9.07683 3.28266Z"
                fill={color || theme.palette.icon.main}
            />
        </svg>
    );
}
