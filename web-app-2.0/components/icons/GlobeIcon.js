import { useTheme } from '@mui/material';

export default function GlobeIcon(props) {
    const theme = useTheme();
    const size = theme.icons.sizes[props.size] || 24;
    let color;
    if (props.color === 'primary') {
        color = theme.palette.primary.main;
    } else if (props.color === 'secondary') {
        color = theme.palette.secondary.main;
    }

    return (
        <svg width={size} height={size} viewBox={`0 0 24 24`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.9601 4.25056C11.3416 3.88743 11.6918 3.75 12 3.75C12.3082 3.75 12.6584 3.88743 13.0399 4.25056C13.4254 4.61737 13.8066 5.18359 14.1431 5.94064C14.3399 6.38346 14.5163 6.88025 14.6675 7.42183C13.8176 7.30953 12.9222 7.25 12 7.25C11.0778 7.25 10.1824 7.30953 9.3325 7.42183C9.48366 6.88025 9.66012 6.38346 9.85693 5.94064C10.1934 5.18359 10.5746 4.61737 10.9601 4.25056ZM7.71187 7.71187C7.91255 6.83663 8.17383 6.0343 8.48621 5.33144C8.64888 4.96543 8.82801 4.62055 9.02341 4.30331C6.86141 5.14 5.14 6.86141 4.30331 9.02341C4.62055 8.82801 4.96543 8.64888 5.33143 8.48621C6.0343 8.17383 6.83663 7.91255 7.71187 7.71187ZM3.75 12C3.75 12.0002 3.75 12.0004 3.75 12.0005C3.75016 12.3087 3.88764 12.6586 4.25056 13.0399C4.61737 13.4254 5.18359 13.8066 5.94064 14.1431C6.38346 14.3399 6.88025 14.5163 7.42183 14.6675C7.30953 13.8176 7.25 12.9222 7.25 12C7.25 11.0778 7.30953 10.1824 7.42183 9.3325C6.88025 9.48366 6.38346 9.66012 5.94064 9.85693C5.18359 10.1934 4.61737 10.5746 4.25056 10.9601C3.88743 11.3416 3.75 11.6918 3.75 12ZM8.98903 15.011C8.83541 14.0803 8.75 13.0661 8.75 12C8.75 10.9339 8.83541 9.91965 8.98903 8.98903C9.91965 8.83541 10.9339 8.75 12 8.75C13.0661 8.75 14.0803 8.83541 15.011 8.98903C15.1646 9.91965 15.25 10.9339 15.25 12C15.25 13.0661 15.1646 14.0803 15.011 15.011C14.0803 15.1646 13.0661 15.25 12 15.25C10.9339 15.25 9.91965 15.1646 8.98903 15.011ZM7.71187 16.2881C6.83663 16.0875 6.0343 15.8262 5.33144 15.5138C4.96543 15.3511 4.62055 15.172 4.30331 14.9766C5.14 17.1386 6.86141 18.86 9.02342 19.6967C8.82801 19.3795 8.64888 19.0346 8.48621 18.6686C8.17383 17.9657 7.91255 17.1634 7.71187 16.2881ZM9.3325 16.5782C10.1824 16.6905 11.0778 16.75 12 16.75C12.9222 16.75 13.8176 16.6905 14.6675 16.5782C14.5163 17.1198 14.3399 17.6165 14.1431 18.0594C13.8066 18.8164 13.4254 19.3826 13.0399 19.7494C12.6584 20.1126 12.3082 20.25 12 20.25C11.6918 20.25 11.3416 20.1126 10.9601 19.7494C10.5746 19.3826 10.1934 18.8164 9.85693 18.0594C9.66012 17.6165 9.48366 17.1198 9.3325 16.5782ZM16.2881 16.2881C16.0875 17.1634 15.8262 17.9657 15.5138 18.6686C15.3511 19.0346 15.172 19.3795 14.9766 19.6967C17.1386 18.86 18.86 17.1386 19.6967 14.9766C19.3795 15.172 19.0346 15.3511 18.6686 15.5138C17.9657 15.8262 17.1634 16.0875 16.2881 16.2881ZM21.75 12C21.75 6.61522 17.3848 2.25 12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12ZM19.6967 9.02342C19.3795 8.82801 19.0346 8.64888 18.6686 8.48621C17.9657 8.17383 17.1634 7.91255 16.2881 7.71187C16.0875 6.83663 15.8262 6.0343 15.5138 5.33144C15.3511 4.96543 15.172 4.62055 14.9766 4.30331C17.1386 5.14 18.86 6.86141 19.6967 9.02342ZM16.5782 9.3325C17.1198 9.48366 17.6165 9.66012 18.0594 9.85693C18.8164 10.1934 19.3826 10.5746 19.7494 10.9601C20.1126 11.3416 20.25 11.6918 20.25 12C20.25 12.3082 20.1126 12.6584 19.7494 13.0399C19.3826 13.4254 18.8164 13.8066 18.0594 14.1431C17.6165 14.3399 17.1198 14.5163 16.5782 14.6675C16.6905 13.8176 16.75 12.9222 16.75 12C16.75 11.0778 16.6905 10.1824 16.5782 9.3325Z"
                fill={props.color || theme.palette.icon.main}
            />
        </svg>
    );
}
