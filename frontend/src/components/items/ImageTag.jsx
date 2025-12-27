import React, { useRef } from "react";

// mui-компоненты
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Link } from "react-router-dom";

const ImageTag = ({ tag_slug, tag_name }) => {

    const tagColors = ["#D1E7DD", "#FFF3CD", "#CFE2FF", "#F8D7DA"];

    const selectTagColor = () => {

        const randomIndex = Math.floor(Math.random() * tagColors.length);

        return tagColors[randomIndex];

    };

    const tagColorRef = useRef(selectTagColor());

    return (
            <Box sx={{ backgroundColor: tagColorRef.current, borderRadius: "10px", px: 1.5, py: 0.5, }}>

                <Link to={"/?page=1&tags=" + tag_slug} style={{ textDecoration: "none", color: "inherit", }}><Typography variant="body1"> {tag_name} </Typography></Link>

            </Box>
    );

}

export default ImageTag;