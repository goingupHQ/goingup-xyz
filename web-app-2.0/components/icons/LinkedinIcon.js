import { useTheme } from '@mui/material';

export default function LinkedinIcon(props) {
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
            <g clipPath='url(#clip0_14_534)'>
                <path
                    d='M19.6332 19.6331H17.2625V15.9203C17.2625 15.035 17.2466 13.8953 16.0294 13.8953C14.7946 13.8953 14.6057 14.8599 14.6057 15.8559V19.6328H12.235V11.9979H14.5109V13.0413H14.5428C15.0069 12.2478 15.8697 11.7739 16.7884 11.808C19.1912 11.808 19.6343 13.3885 19.6343 15.4447L19.6332 19.6331ZM9.55987 10.9543C8.80004 10.9544 8.18397 10.3386 8.18382 9.57875C8.18367 8.81892 8.79956 8.20285 9.55936 8.2027C10.3192 8.20255 10.9353 8.81843 10.9354 9.57823C10.9356 10.3381 10.3197 10.9542 9.55987 10.9543ZM10.7453 19.6331H8.37202V11.9979H10.7453V19.6331ZM20.8152 6.0011H7.18069C6.53631 5.99382 6.00787 6.50999 6 7.15436V20.8454C6.00761 21.4901 6.53598 22.0068 7.18069 21.9999H20.8152C21.4612 22.008 21.9916 21.4914 22.0005 20.8454V7.1534C21.9913 6.50773 21.4608 5.9916 20.8152 6.0001V6.0011Z'
                    fill={color || theme.palette.icon.contacts}
                />
            </g>
            <defs>
                <clipPath id='clip0_14_534'>
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
