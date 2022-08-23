import {
  Alert,
  Box,
  Button,
  Checkbox,
  Grid,
  Typography,
  Stack,
  Snackbar,
  TextField,
  Modal,
} from "@mui/material";
import Head from "next/head";
import React, { useState, useContext } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContract,
  useSigner
} from "wagmi";
import { mumbaiAddress, projectsAbi } from "../../contexts/projects-context";
import { AppContext } from "../../contexts/app-context";
import DatePicker from "../../components/ui/datepicker";
import {BigNumber, parseUnits} from 'ethers';
import { formatUnits } from "ethers/lib/utils";

export default function CreateProject(props) {
  const app = useContext(AppContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [started, setStarted] = useState("");
  const [ended, setEnded] = useState("");
  const [primaryUrl, setPrimaryUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [isPrivate, setIsPrivate] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // console.log(app);
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

  // const createProject = useContractWrite({
  //   addressOrName: mumbaiAddress,
  //   contractInterface: projectsAbi,
  //   functionName: "create",
  //   chainId: 80001,
  //   args: [name, description, started, ended, primaryUrl, tags, isPrivate],
  //   mode: 'recklesslyUnprepared',
  //   watch: true,
  // });

  const { data: signer } = useSigner();

  const contract = useContract({
    addressOrName: mumbaiAddress,
    contractInterface: projectsAbi,
    signerOrProvider: signer,
    functionName: "create",
    chainId: 80001,
    watch: true,
  });

  // const { data, isLoading, isSuccess, write } = useContractWrite(config);

  console.log(started && BigNumber.from(parseInt(started)).toString());
  return (
    <>
      <Head>
        <title>Going UP - Create A Project</title>
      </Head>

      <Stack spacing="2rem" justify="center">
        <Typography variant="h1">Create A Project</Typography>

        <Stack width={{ xs: "100%", md: "50%" }} spacing="0.75rem">
          <Typography variant="h2">Project Name</Typography>
          <TextField
            onChange={(e) => setName(e.target.value)}
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={name}
            placeholder="Project Example Name"
          />
        </Stack>

        <Stack width={{ xs: "100%", md: "50%" }} spacing="0.75rem">
          <Typography variant="h2">Project Description</Typography>
          <TextField
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            id="outlined-basic"
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            placeholder="This project is about..."
          />

          <Stack
            p={1}
            border={
              new Date(ended) <= new Date(started) ? "2px solid red" : "none"
            }
            borderRadius="16px"
            spacing="16px"
          >
            <DatePicker
              label={`Started`}
              value={started}
              onChange={(e) => setStarted(BigNumber.from(parseInt(e.target.value)).toString())}
              placeholder={"YYYY-MM-DD"}
            />

            <DatePicker
              label={`Ended`}
              value={ended}
              onChange={(e) => setEnded(BigNumber.from(parseInt(e.target.value)).toString())}
              placeholder={"YYYY-MM-DD"}
            />
            {new Date(ended) <= new Date(started) && (
              <Alert variant="filled" severity="error">
                End date must be after start date
              </Alert>
            )}
          </Stack>
        </Stack>
        <Stack width={{ xs: "100%", md: "50%" }} spacing="0.75rem">
          <Typography variant="h2">Project Link</Typography>
          <TextField
            onChange={(e) => setPrimaryUrl(e.target.value)}
            value={primaryUrl}
            id="outlined-basic"
            label="Primary URL"
            variant="outlined"
            placeholder="https://www.project.com"
          />
        </Stack>
        <Stack width={{ xs: "100%", md: "50%" }} spacing={2}>
          <Typography variant="h2">Project Tags</Typography>
          <Button variant="outlined" onClick={handleOpen}>
            Select Tags
          </Button>
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
                    onClick={() =>
                      !tags.includes(occupation.text) &&
                      setTags([...tags, occupation.text])
                    }
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
                onClick={() => setTags(tags.filter((item) => item !== tag))}
                marginLeft="8px"
              >
                <Typography variant="h3">{tag}</Typography>
              </Button>
            ))}
          </Grid>
          <Checkbox 
          onChange={(e) => setIsPrivate(e.target.checked)}
          label="Is it a private project?" defaultChecked />

        </Stack>


        <Button variant="contained" onClick={() => contract.create(name, description, started, ended, primaryUrl, JSON.stringify(tags), isPrivate)}>
          Create Project
        </Button>
        {/* {error && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              An error occurred preparing the transaction: {error.message}
            </Alert>
          </Snackbar>
        )} */}
      </Stack>
    </>
  );
}
