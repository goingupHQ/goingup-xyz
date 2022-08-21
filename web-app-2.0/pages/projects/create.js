import {
  Alert,
  Box,
  Button,
  Grid,
  Typography,
  Stack,
  TextField,
  Modal,
} from "@mui/material";
import Head from "next/head";
import React, { useState, useContext } from "react";
import { useAccount, useNetwork, useContract, useSigner } from "wagmi";
import { mumbaiAddress } from "../../contexts/projects-context";
import { AppContext } from "../../contexts/app-context";
import DatePicker from "../../components/ui/datepicker";


export default function CreateProject(props) {
  const app = useContext(AppContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [started, setStarted] = useState("");
  const [ended, setEnded] = useState("");
  const [primaryUrl, setPrimaryUrl] = useState("");
  const [tags, setTags] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log(app);
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  console.log(started, ended)

  return (
    <>
      <Head>
        <title>Going UP - Create A Project</title>
      </Head>

      <Stack spacing="2rem" justify="center">
        <Typography variant="h1">Create A Project</Typography>

        <Stack width={{xs: "100%", md: "50%"}} spacing="0.75rem">
          <Typography variant="h2">Project Name</Typography>
          <TextField
            onChange={(e) => setName(e.target.value)}
            id="outlined-basic"
            label="Name"
            variant="outlined"
          />
        </Stack>

        <Stack width={{xs: "100%", md: "50%"}} spacing="0.75rem">
          <Typography variant="h2">Project Description</Typography>
          <TextField
            onChange={(e) => setDescription(e.target.value)}
            id="outlined-basic"
            label="Description"
            variant="outlined"
            multiline
          rows={4}
          />
        </Stack>

        <Stack width={{xs: "100%", md: "50%"}} spacing={2}>
          <Typography variant="h2">Project Tags</Typography>
          <Button onClick={handleOpen}>Select Tags</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Grid columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
                {app.occupations.map((occupation) => (
                  <Button
                    key={occupation.id}
                    p="0.5rem"
                    variant="contained"
                    onClick={() => !tags.includes(occupation.text) && setTags([...tags, occupation.text])}
                    margin={1}
                  >
                    <Typography color="black" variant="h3">
                      {occupation.text}
                    </Typography>
                  </Button>
                ))}
              </Grid>
            </Box>
          </Modal>
          <Grid spacing="16px">
            {" "}
            {tags.map((tag, id) => (
              <Button
                key={id}
                p="0.5rem"
                variant="outlined"
                onClick={() =>      setTags(tags.filter(item => item !== tag))}
                marginLeft="8px"
              >
                <Typography variant="h3">{tag}</Typography>
              </Button>
            ))}
          </Grid>

      <Stack
        p={1}
        border={new Date(ended) <= new Date(started) ? "2px solid red" : "none"}
        borderRadius="1rem"
        spacing="16px"
      >
          <DatePicker
        label={`Started`}
        value={started}
        onChange={(e) => setStarted(e.target.value)}
        placeholder={'YYYY-MM-DD'}
      />

      <DatePicker
        label={`Ended`}
        value={ended}
        onChange={(e) => setEnded(e.target.value)}
        placeholder={'YYYY-MM-DD'}
      />
         {new Date(ended) <= new Date(started) && (
        <Alert variant="filled" severity="error">
          End date must be after start date
      </Alert>
      )}

      </Stack> 
    

   
        </Stack>
      </Stack>
    </>
  );
}
