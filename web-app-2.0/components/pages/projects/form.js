import {
  Button,
  Checkbox,
  Grid,
  Typography,
  Stack,
  TextField,
  Autocomplete,
  Chip,
  FormControlLabel,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useState, useContext, useEffect } from "react";
import { ProjectsContext } from "../../../contexts/projects-context";
import { AppContext } from "../../../contexts/app-context";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import moment from "moment";

export default function ProjectForm(projectData) {
  const projectsCtx = useContext(ProjectsContext);
  const app = useContext(AppContext);
  const router = useRouter();

  const isCreate = router.pathname === "/projects/create";

  const [form, setForm] = useState({
    name: "",
    description: "",
    started: null,
    ended: null,
    primaryUrl: "",
    tags: [],
    isPrivate: false,
  });

  const [oldForm, setOldForm] = useState({
    name: "",
    description: "",
    started: null,
    ended: null,
    primaryUrl: "",
    tags: [],
    isPrivate: false,
  });

  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (projectData.projectData) {
      setForm({...form, 
        name: projectData.projectData.name,
        description: projectData.projectData.description,
        started: projectData.projectData.started.toNumber() !== 0 ? new Date(projectData.projectData.started.toNumber() * 1000) : null,
        ended: projectData.projectData.ended.toNumber() !== 0 ? new Date(projectData.projectData.ended.toNumber() * 1000) : null,
        primaryUrl: projectData.projectData.primaryUrl,
        tags: projectData.projectData.tags.split(", "),
        isPrivate: projectData.projectData.isPrivate,
    });

    setOldForm({...oldForm, 
        name: projectData.projectData.name,
        description: projectData.projectData.description,
        started: projectData.projectData.started.toNumber() !== 0 ? new Date(projectData.projectData.started.toNumber() * 1000) : null,
        ended: projectData.projectData.ended.toNumber() !== 0 ? new Date(projectData.projectData.ended.toNumber() * 1000) : null,
        primaryUrl: projectData.projectData.primaryUrl,
        tags: projectData.projectData.tags.split(", "),
        isPrivate: projectData.projectData.isPrivate,
    });
      setLoading(false);
    } else {
      setLoading(false)
    }
  }, [projectData]);

  const sendProject = async () => {
    closeSnackbar();
    setLoading(true);

    try {
      enqueueSnackbar("Creating transactions, please approve on your wallet", {
        variant: "info",
        persist: true,
      });

      if (isCreate) {
        const createTx = await projectsCtx.createProject(form);

        closeSnackbar();

        enqueueSnackbar("Waiting for transaction confirmations", {
          variant: "info",
          persist: true,
          action: (key) => {
            <Button
              onClick={() => {
                const baseUrl = projectsCtx.networkParams.blockExplorers[0];
                window.open(`${baseUrl}tx/${createTx.hash}`);
              }}
            >
              Show Transaction
            </Button>;
          },
        });
        await createTx.wait();
        closeSnackbar();

        enqueueSnackbar("Project created", { variant: "success" });
        router.push("/projects");
      } else {
        const updateTx = await projectsCtx.updateProject(form, oldForm, router.query.id);

        closeSnackbar();

        enqueueSnackbar("Waiting for transaction confirmations", {
          variant: "info",
          persist: true,
          action: (key) => {
            <Button
              onClick={() => {
                const baseUrl = projectsCtx.networkParams.blockExplorers[0];
                window.open(`${baseUrl}tx/${createTx.hash}`);
              }}
            >
              Show Transaction
            </Button>;
          },
        });
        await updateTx.wait();
        closeSnackbar();

        enqueueSnackbar("Project updated", { variant: "success" });
        router.push("/projects");
      }
    } catch (e) {
      closeSnackbar();
      if (typeof e === "string") {
        enqueueSnackbar(e, { variant: "error" });
      } else {
        enqueueSnackbar(e.message || `Sorry something went wrong`, {
          variant: "error",
        });
      }
      console.log(e)

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack
        mt="4rem"
        spacing={1}
        sx={{ width: { xs: "100%", md: "60%", lg: "50%", xl: "40%" } }}
      >
        <Typography variant="h1" sx={{ paddingLeft: 2 }}>
          Create A Project
        </Typography>

        <Grid container columnSpacing={2} rowSpacing={2} sx={{ padding: 0 }}>
          <Grid item xs={12}>
            <TextField
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              id="outlined-basic"
              label="Project Name"
              variant="outlined"
              value={form.name}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              value={form.description}
              id="outlined-basic"
              label="Project Description"
              variant="outlined"
              multiline
              rows={4}
              placeholder="This project is about..."
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              label="Started"
              inputFormat="MM/DD/yyyy"
              value={form.started}
              onChange={(e) => setForm({ ...form, started: e })}
              renderInput={(params) => (
                <TextField {...params} autoComplete={false} fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              label="Ended"
              inputFormat="MM/DD/yyyy"
              value={form.ended}
              onChange={(e) => setForm({ ...form, ended: e })}
              renderInput={(params) => (
                <TextField {...params} autoComplete={false} fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              onChange={(e) => setForm({ ...form, primaryUrl: e.target.value })}
              value={form.primaryUrl}
              id="outlined-basic"
              label="Primary URL"
              variant="outlined"
              placeholder="https://www.project.com"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              value={form.tags?.length === 0 ? [] : form.tags}
              options={[]}
              onChange={(e, value) => {
                setForm({ ...form, tags: value });
              }}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Tags" />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              label="Is this a private project?"
              control={
                <Checkbox
                  checked={form.isPrivate}
                  onChange={(e) =>
                    setForm({ ...form, isPrivate: e.target.checked })
                  }
                />
              }
            />
          </Grid>

          <Grid item xs={12}>
            <LoadingButton variant="contained" onClick={() => sendProject()}>
              {isCreate ? "Create Project" : "Update Project"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Stack>

      <Backdrop open={loading} sx={{ opacity: 1 }}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}
