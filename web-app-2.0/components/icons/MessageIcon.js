import { useTheme } from '@mui/material';

export default function MessageIcon(props) {
    const theme = useTheme();
    const size = theme.icons.sizes[props.size] || 24;

    return (
        <svg width={size} height={size} viewBox={`0 0 24 24`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 3.25H9.94358C8.10582 3.24998 6.65019 3.24997 5.51098 3.40313C4.33856 3.56076 3.38961 3.89288 2.64124 4.64124C1.89288 5.38961 1.56076 6.33855 1.40313 7.51098C1.24997 8.65019 1.24998 10.1058 1.25 11.9436V12V12.0564C1.24998 13.8942 1.24997 15.3498 1.40313 16.489C1.56076 17.6614 1.89288 18.6104 2.64124 19.3588C3.38961 20.1071 4.33856 20.4392 5.51098 20.5969C6.65018 20.75 8.1058 20.75 9.94354 20.75H9.94359H10H14H14.0564H14.0565C15.8942 20.75 17.3498 20.75 18.489 20.5969C19.6614 20.4392 20.6104 20.1071 21.3588 19.3588C22.1071 18.6104 22.4392 17.6614 22.5969 16.489C22.75 15.3498 22.75 13.8942 22.75 12.0565V12.0564V12V11.9436V11.9435C22.75 10.1058 22.75 8.65018 22.5969 7.51098C22.4392 6.33855 22.1071 5.38961 21.3588 4.64124C20.6104 3.89288 19.6614 3.56076 18.489 3.40313C17.3498 3.24997 15.8942 3.24998 14.0564 3.25H14H10ZM3.7019 5.7019C4.12511 5.27869 4.70476 5.02502 5.71085 4.88976C6.73851 4.75159 8.09318 4.75 10 4.75H14C15.9068 4.75 17.2615 4.75159 18.2892 4.88976C19.2952 5.02502 19.8749 5.27869 20.2981 5.7019C20.7213 6.12511 20.975 6.70476 21.1102 7.71085C21.2484 8.73851 21.25 10.0932 21.25 12C21.25 13.9068 21.2484 15.2615 21.1102 16.2892C20.975 17.2952 20.7213 17.8749 20.2981 18.2981C19.8749 18.7213 19.2952 18.975 18.2892 19.1102C17.2615 19.2484 15.9068 19.25 14 19.25H10C8.09318 19.25 6.73851 19.2484 5.71085 19.1102C4.70476 18.975 4.12511 18.7213 3.7019 18.2981C3.27869 17.8749 3.02502 17.2952 2.88976 16.2892C2.75159 15.2615 2.75 13.9068 2.75 12C2.75 10.0932 2.75159 8.73851 2.88976 7.71085C3.02502 6.70476 3.27869 6.12511 3.7019 5.7019ZM6.41603 7.37596C6.07138 7.1462 5.60573 7.23933 5.37596 7.58397C5.1462 7.92862 5.23933 8.39427 5.58397 8.62404L11.584 12.624C11.8359 12.792 12.1641 12.792 12.416 12.624L18.416 8.62404C18.7607 8.39427 18.8538 7.92862 18.624 7.58397C18.3943 7.23933 17.9286 7.1462 17.584 7.37596L12 11.0986L6.41603 7.37596Z"
                fill={theme.palette.icon.main}
            />
        </svg>
    );
}