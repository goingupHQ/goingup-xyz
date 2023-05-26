import { AppContext, Availability } from '@/contexts/app-context';
import { Autocomplete, TextField } from '@mui/material';
import { useContext, useState } from 'react';

type AvailabilitySelectProps = {
  value: Availability[];
  setValue: (value: Availability[]) => void;
  label?: string;
};

const AvailabilitySelect = ({ value, setValue, label }: AvailabilitySelectProps) => {
  const app = useContext(AppContext);
  const { availability } = app;
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <Autocomplete
      multiple
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={availability}
      getOptionLabel={(option: Availability) => option.text}
      disableCloseOnSelect
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || 'Availability'}
          required
        />
      )}
    />
  );
};

export default AvailabilitySelect;
