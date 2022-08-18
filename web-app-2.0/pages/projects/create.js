import { Typography } from '@mui/material'
import Head from 'next/head'
import React from 'react'
import { useAccount, useNetwork , useContract, useSigner} from "wagmi";
// import {mumbaiAddress} from "../contexts/projects-context";

export default function CreateProject(props) {
    
    
    return (
        <>
            <Head>
                <title>Going UP - Create A Project</title>
            </Head>
            <Typography variant="h1">Create A Project</Typography>
        </>
    )
}
