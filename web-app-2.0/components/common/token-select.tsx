import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

type TokenSelectProps = {
  tier: number;
  setTier: (tier: number) => void;
};

const TokenSelect = ({ tier, setTier }: TokenSelectProps) => {
  return (
    <FormControl fullWidth>
      <Select
        value={tier}
        onChange={(e) => {
          setTier(parseInt(e.target.value as string));
        }}
      >
        <MenuItem value={1}>Appreciation Token Tier 1</MenuItem>
        <MenuItem value={2}>Appreciation Token Tier 2</MenuItem>
        <MenuItem value={3}>Appreciation Token Tier 3</MenuItem>
        <MenuItem value={4}>Appreciation Token Tier 4</MenuItem>
      </Select>
    </FormControl>
  );
};

export default TokenSelect;
