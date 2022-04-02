import type { ReactNode } from 'react';

// import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import LocalLibraryTwoToneIcon from '@mui/icons-material/LocalLibraryTwoTone';
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';

export interface MenuItem {
    link?: string;
    icon?: ReactNode;
    badge?: string;

    items?: MenuItem[];
    name: string;
}

export interface MenuItems {
    items: MenuItem[];
    heading: string;
}

const menuItems: MenuItems[] = [
    {
        heading: '',
        items: [
            {
                name: 'Dashboard',
                link: '/dashboard',
                icon: DashboardTwoToneIcon
            },
            {
                name: 'My Profile',
                link: '/my-profile',
                icon: AccountBoxTwoToneIcon
            },
            {
                name: 'Projects',
                link: '/projects',
                icon: WorkTwoToneIcon
            },
            {
                name: 'Users',
                link: '/users',
                icon: PeopleAltTwoToneIcon
            },
            // {
            //     name: 'Events',
            //     link: '/events',
            //     icon: EmojiEventsTwoToneIcon
            // },
            // {
            //     name: 'Mentoring',
            //     link: '/mentoring',
            //     icon: LocalLibraryTwoToneIcon
            // },
            {
                name: 'Settings',
                link: '/settings',
                icon: SettingsApplicationsTwoToneIcon
            },
            // {
            //     name: '',
            //     icon: MenuTwoToneIcon,
            //     link: '',
            //     items: [
            //         {
            //             name: 'Doctors',
            //             link: '/blueprints/top-navigation/dashboards/healthcare/doctor'
            //         },
            //         {
            //             name: 'Hospital',
            //             link: '/blueprints/top-navigation/dashboards/healthcare/hospital'
            //         },
            //         {
            //             name: 'Helpdesk',
            //             link: '/blueprints/top-navigation/dashboards/helpdesk'
            //         },
            //         {
            //             name: 'Learning',
            //             link: '/blueprints/top-navigation/dashboards/learning'
            //         },
            //         {
            //             name: 'Monitoring',
            //             link: '/blueprints/top-navigation/dashboards/monitoring'
            //         },
            //         {
            //             name: 'Tasks',
            //             link: '/blueprints/top-navigation/dashboards/tasks'
            //         }
            //     ]
            // }
        ]
    }
];

export default menuItems;
