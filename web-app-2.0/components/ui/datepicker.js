import React from 'react'
import {
	Stack,
	Input,
	Typography,
} from '@mui/material'

function DatePicker({
	label,
	value,
	onChange,
	placeholder,
    started,
    ended
}) {
	return (
		<Stack
			flex={1}
			direction="column">
			<Typography
				lineHeight="20px"
				fontWeight="bold">
				{label}
			</Typography>
				<Input
					placeholder={placeholder}
					// value={value}
					onChange={onChange}
					type="date"
					// max={started && new Date().toString()}
                    // min={ended}
				/>
		</Stack>
	)
}

export default DatePicker
