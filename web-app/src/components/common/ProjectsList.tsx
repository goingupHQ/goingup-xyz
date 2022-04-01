import React from 'react';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    ButtonGroup,
    Button
} from '@mui/material';
import moment from 'moment';

export default function ProjectsList(props) {
    const { projects, hideActions, formRef } = props;
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Completion</TableCell>
                            <TableCell>URL</TableCell>
                            <TableCell>Skills {`&`} Deliverables</TableCell>
                            {!hideActions && <TableCell></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects?.map((p) => (
                            <TableRow
                                key={p.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {p.title}
                                </TableCell>
                                <TableCell>{p.description}</TableCell>
                                <TableCell>
                                    {p.completion ? moment(p.completion).format('LL') : ``}
                                </TableCell>
                                <TableCell>
                                    <a href={p.projectUrl} target="_blank" rel="noopener noreferrer">
                                        {p.projectUrl}
                                    </a>
                                </TableCell>
                                <TableCell>{p.skills.join(', ')}</TableCell>
                                {!hideActions && (
                                    <TableCell>
                                        <ButtonGroup
                                            variant="outlined"
                                            orientation="vertical"
                                        >
                                            <Button onClick={() => formRef.current?.show('update', p)}>
                                                Update
                                            </Button>
                                            <Button onClick={() => formRef.current?.show('delete', p)}>
                                                Delete
                                            </Button>
                                        </ButtonGroup>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
