import { useContext } from "react";

import {
    Stack,
    Box,
    Typography
} from "@mui/material"
import Link from "next/link"
import { AppContext } from "../../contexts/app-context";


export default function ProjectCard({
    link, 
    topText,
    name,
    tags
}) {
    const app = useContext(AppContext);
    return (
        <Link href={link}>
        <Stack 
          alignItems="center"
          direction="row"
          p="15px"
          backgroundColor={
            app.mode === "dark" ? "#19222C" : "#FFFFFF"
          }
          sx={{
            borderRadius: "8px",
            "&:hover": {
              cursor: "pointer",
            },
            boxShadow: "0px 8px 28px rgba(0, 0, 0, 0.1)",
          }}
          width="fit-content"
          minWidth="285px"
          height="fit-content"
          spacing={2}
        >
           <Box
              component="img"
              sx={{
              height: "80px",
              width: "80px",
              }}
              borderRadius="8px"
              alt="project image"
              src={topText === "from" ? "https://ik.imagekit.io/bayc/assets/bayc-footer.png" : "https://neilpatel.com/wp-content/uploads/2017/05/LinkedIn.jpg"}
          />
          <Stack
            spacing={1}
            height="85px"
          >
            <Typography
              sx={{
                fontFamily: "Gilroy",
                fontStyle: "normal",
                fontWeight: "600",
                fontSize: "12px",
                lineHeight: "14px",
                color: "#6E8094",
              }}
            >
              {topText}
            </Typography>
            <Typography
              variant="h3"
              color={app.mode === "dark" ? "#FFFFFF" : "#081724"}
            >
              {name}
            </Typography>
            <Stack item flexDirection="row">
              {tags?.slice(0, 3).map((tag, index) => (
                <Stack
                  key={index}
                  item
                  flexDirection="row"
                  backgroundColor={
                    app.mode === "dark" ? "#253340" : "#F5F5F5"
                  }
                  sx={{
                    width: {
                      xs: "100%",
                      md: "60%",
                      lg: "50%",
                      xl: "40%",
                    },
                    borderRadius: "8px",
                  }}
                  justifyContent="center"
                  p={1}
                  m={"0.25rem"}
                >
                  <Typography
                    sx={{
                      fontFamily: "Gilroy",
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "12px",
                    }}
                    color={
                      app.mode === "dark" ? "#FFFFFF" : "#081724"
                    }
                  >
                    {tag}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Link>
    )
}