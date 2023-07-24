import { AppContext, Occupation } from '@/contexts/app-context';
import { Autocomplete, TextField } from '@mui/material';
import { useContext, useState } from 'react';

type OccupationSelectProps = {
  value: Occupation | null;
  setValue: (value: Occupation | null) => void;
};

const OccupationSelect = ({ value, setValue }: OccupationSelectProps) => {
  const app = useContext(AppContext);
  const { occupations } = app;
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={occupations}
      getOptionLabel={(option: Occupation) => option.text}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Occupation"
          required
        />
      )}
    />
  );
};

export default OccupationSelect;
