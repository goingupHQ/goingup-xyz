import { useTheme } from '@mui/material';

export default function GithubIcon(props) {
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
            <g clipPath='url(#clip0_14_533)'>
                <path
                    d='M14 6.33333C9.58 6.33333 6 9.85333 6 14.1947C6 17.6687 8.292 20.6147 11.47 21.6533C11.87 21.7273 12.0167 21.484 12.0167 21.2753C12.0167 21.0887 12.01 20.594 12.0067 19.9387C9.78133 20.4127 9.312 18.884 9.312 18.884C8.948 17.9767 8.422 17.734 8.422 17.734C7.69733 17.2467 8.478 17.2567 8.478 17.2567C9.28133 17.3113 9.70333 18.0667 9.70333 18.0667C10.4167 19.2687 11.576 18.9213 12.0333 18.7207C12.1053 18.212 12.3113 17.866 12.54 17.6693C10.7633 17.4727 8.896 16.7967 8.896 13.7847C8.896 12.9267 9.206 12.2253 9.71933 11.6753C9.62933 11.4767 9.35933 10.6773 9.78933 9.59466C9.78933 9.59466 10.4593 9.38399 11.9893 10.4007C12.6293 10.226 13.3093 10.1393 13.9893 10.1353C14.6693 10.1393 15.3493 10.226 15.9893 10.4007C17.5093 9.38399 18.1793 9.59466 18.1793 9.59466C18.6093 10.6773 18.3393 11.4767 18.2593 11.6753C18.7693 12.2253 19.0793 12.9267 19.0793 13.7847C19.0793 16.8047 17.2093 17.4693 15.4293 17.6627C15.7093 17.8987 15.9693 18.3807 15.9693 19.1173C15.9693 20.1693 15.9593 21.0147 15.9593 21.27C15.9593 21.476 16.0993 21.722 16.5093 21.6433C19.71 20.6113 22 17.6633 22 14.1947C22 9.85333 18.418 6.33333 14 6.33333Z'
                    fill={color || theme.palette.icon.contacts}
                />
            </g>
            <defs>
                <clipPath id='clip0_14_533'>
                    <rect
                        width='16'
                        height='16'
                        fill='white'
                        transform='translate(6 6)'
                    />
                </clipPath>
            </defs>
        </svg>
    );
}
