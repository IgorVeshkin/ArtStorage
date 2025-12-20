import React from "react";

// mui-компоненты
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";


const CenteredPageSpinner = () => {

    return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}>
               <CircularProgress />
            </Box>
    );

}

export default CenteredPageSpinner;