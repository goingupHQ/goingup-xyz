import { useTheme } from '@mui/material';

export default function SettingsIcon(props) {
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
                d="M10.7499 4C10.7499 3.30964 11.3095 2.75 11.9999 2.75C12.6903 2.75 13.2499 3.30964 13.2499 4V5.28988C13.2499 5.6217 13.4679 5.91407 13.786 6.00872C14.7355 6.29132 15.5914 6.79407 16.294 7.45874C16.535 7.68671 16.8971 7.72928 17.1844 7.56341L18.3032 6.91748C18.9011 6.5723 19.6656 6.77714 20.0108 7.37501C20.3559 7.97287 20.1511 8.73736 19.5532 9.08254L18.4358 9.72768C18.1488 9.89341 18.0045 10.2279 18.0811 10.5504C18.1913 11.0149 18.2499 11.5001 18.2499 12C18.2499 12.4999 18.1913 12.9851 18.0811 13.4496C18.0045 13.7721 18.1488 14.1066 18.4358 14.2723L19.5532 14.9174C20.151 15.2626 20.3559 16.0271 20.0107 16.6249C19.6655 17.2228 18.901 17.4277 18.3032 17.0825L17.1844 16.4366C16.8971 16.2707 16.535 16.3133 16.294 16.5413C15.5914 17.2059 14.7355 17.7087 13.786 17.9913C13.4679 18.0859 13.2499 18.3783 13.2499 18.7101V20C13.2499 20.6904 12.6903 21.25 11.9999 21.25C11.3095 21.25 10.7499 20.6904 10.7499 20V18.7101C10.7499 18.3783 10.5319 18.0859 10.2138 17.9913C9.26433 17.7087 8.40848 17.206 7.70584 16.5414C7.46485 16.3134 7.10273 16.2708 6.81545 16.4367L5.69683 17.0825C5.09896 17.4277 4.33447 17.2229 3.98929 16.625C3.64412 16.0271 3.84896 15.2627 4.44683 14.9175L5.56399 14.2725C5.85105 14.1067 5.99527 13.7722 5.91871 13.4497C5.80843 12.9852 5.74988 12.4999 5.74988 12C5.74988 11.5001 5.80843 11.0148 5.91871 10.5503C5.99527 10.2278 5.85105 9.89325 5.56399 9.72752L4.44675 9.08248C3.84888 8.7373 3.64404 7.97281 3.98922 7.37495C4.33439 6.77708 5.09888 6.57224 5.69675 6.91741L6.81545 7.5633C7.10274 7.72916 7.46485 7.6866 7.70584 7.45864C8.40848 6.79401 9.26433 6.2913 10.2138 6.00872C10.5319 5.91407 10.7499 5.62169 10.7499 5.28988V4ZM11.9999 1.25C10.4811 1.25 9.2499 2.48122 9.2499 4V4.75228C8.46368 5.05074 7.73906 5.47319 7.0998 5.99542L6.44675 5.61838C5.13144 4.85899 3.44957 5.30964 2.69018 6.62495C1.93079 7.94025 2.38144 9.62213 3.69675 10.3815L4.34897 10.7581C4.28373 11.1628 4.24988 11.5777 4.24988 12C4.24988 12.4223 4.28373 12.8372 4.34897 13.2419L3.69683 13.6184C2.38152 14.3778 1.93087 16.0597 2.69026 17.375C3.44965 18.6903 5.13152 19.141 6.44683 18.3816L7.0998 18.0046C7.73906 18.5268 8.46368 18.9493 9.2499 19.2477V20C9.2499 21.5188 10.4811 22.75 11.9999 22.75C13.5187 22.75 14.7499 21.5188 14.7499 20V19.2477C15.5362 18.9492 16.2608 18.5267 16.9001 18.0045L17.5532 18.3815C18.8685 19.1409 20.5503 18.6903 21.3097 17.3749C22.0691 16.0596 21.6185 14.3778 20.3032 13.6184L19.6508 13.2418C19.716 12.8371 19.7499 12.4223 19.7499 12C19.7499 11.5777 19.716 11.1629 19.6508 10.7582L20.3032 10.3816C21.6185 9.62218 22.0692 7.94031 21.3098 6.62501C20.5504 5.3097 18.8685 4.85905 17.5532 5.61844L16.9001 5.99553C16.2608 5.47325 15.5362 5.05077 14.7499 4.75229V4C14.7499 2.48122 13.5187 1.25 11.9999 1.25ZM9.74988 12C9.74988 10.7574 10.7572 9.75 11.9999 9.75C13.2425 9.75 14.2499 10.7574 14.2499 12C14.2499 13.2426 13.2425 14.25 11.9999 14.25C10.7572 14.25 9.74988 13.2426 9.74988 12ZM11.9999 8.25C9.92881 8.25 8.24988 9.92893 8.24988 12C8.24988 14.0711 9.92881 15.75 11.9999 15.75C14.0709 15.75 15.7499 14.0711 15.7499 12C15.7499 9.92893 14.0709 8.25 11.9999 8.25Z"
                fill={color || theme.palette.icon.main}
            />
        </svg>
    );
}
