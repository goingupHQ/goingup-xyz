import React from 'react';
import { Organization } from '@/types/organization';
import { useNavItems } from './use-nav-items';
import { useMediaQuery, Theme, Button, Box, Typography, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';

type NavigationProps = {
  org?: Organization | null;
};

const Navigation = ({ org }: NavigationProps) => {
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const navItems = useNavItems(org);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const mobileMenuOpen = Boolean(anchorEl);
  const handleMobileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ my: 2 }}>
      {isMdAndUp ? (
        <>
          <Typography sx={{ display: 'inline' }}>Organizations Menu: </Typography>
          {navItems.map((item, index) => (
            <Link
              href={item.to}
              key={index}
            >
              <Button
                variant="text"
                sx={{ textTransform: 'none' }}
              >
                {item.text}
              </Button>
            </Link>
          ))}
        </>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={handleMobileClick}
          >
            Organizations Menu
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={mobileMenuOpen}
            onClose={handleMobileClose}
          >
            {navItems.map((item, index) => (
              <Link href={item.to} key={index}>
                <MenuItem onClick={handleMobileClose}>{item.text}</MenuItem>
              </Link>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
};

export default Navigation;
