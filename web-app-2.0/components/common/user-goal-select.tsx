import { AppContext, UserGoal } from '@/contexts/app-context';
import { Autocomplete, TextField } from '@mui/material';
import { useContext, useState } from 'react';

type UserGoalSelectProps = {
  value: UserGoal[];
  setValue: (value: UserGoal[]) => void;
  label?: string;
};

const UserGoalSelect = ({ value, setValue, label }: UserGoalSelectProps) => {
  const app = useContext(AppContext);
  const { userGoals } = app;
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
      options={userGoals}
      getOptionLabel={(option: UserGoal) => option.text}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || 'My goals are...'}
          required
        />
      )}
    />
  );
};

export default UserGoalSelect;
