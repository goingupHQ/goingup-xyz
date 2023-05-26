import { AppContext, Occupation } from '@/contexts/app-context';
import { Autocomplete, TextField } from '@mui/material';
import { useContext, useState } from 'react';

type OccupationMultiSelectProps = {
  value: Occupation[];
  setValue: (value: Occupation[]) => void;
  label: string;
};

const OccupationMultiSelect = ({ value, setValue, label }: OccupationMultiSelectProps) => {
  const app = useContext(AppContext);
  const { occupations } = app;
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
    options={occupations}
    disableCloseOnSelect
    getOptionLabel={(option: Occupation) => option.text}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || 'Occupation'}
        />
      )}
    />
  );
};

export default OccupationMultiSelect;
