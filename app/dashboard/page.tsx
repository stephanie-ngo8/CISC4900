import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from "react";

export default function Dashboard() {
    return  <Box sx={{
        p: 2
    }}>
        <Typography paragraph >
            This purchase requisition workflow application aims to simplify and organize the process of requesting, approving, and tracking purchases within CAMBA’s organization. By digitizing this essential workflow, it aims to enhance efficiency, reduce errors, and provide greater visibility and control over this process.
        </Typography>
    </Box>
}