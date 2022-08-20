import {
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
import { TagFacesSharp } from "@mui/icons-material";

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

  return (
    <>
      <Head>
        <title>Going UP - Create A Project</title>
      </Head>

      <Stack spacing="2rem">
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
                    sx={{
                        border: "1px solid",
                        borderColor: "black"
                      }}
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
          <Grid spacing={{ xs: 2, md: 3 }}>
            {" "}
            {tags.map((tag, id) => (
              <Button
                key={id}
                p="0.5rem"
                sx={{
                  border: "1px solid",
                  borderColor: app.mode === "light" ? "black" : "white",
                }}
                onClick={() =>      setTags(tags.filter(item => item !== tag))}
              >
                <Typography variant="h3">{tag}</Typography>
              </Button>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </>
  );
}
