import React, { useState, useEffect, useRef } from "react";

import axios from "axios";

import loggedAPI from "../api/axiosInstances";

import { useParams, useNavigate } from "react-router-dom";

// mui-компоненты
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Stack from "@mui/material/Stack";
import Alert from '@mui/material/Alert';

import ImageTag from "../items/ImageTag.jsx"


const pageStyles = {

    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        m: 2,
        gap: 2,
    }

}

function DetailedPage() {

    const { record_uuid } = useParams();

    const [imageData, setImageData] = useState({});
    const [likesData, setLikesData] = useState(
        {
            "likesCount": 0,
            "isLiked": false
        });


    const navigate = useNavigate();

    const handleReturnBackClick = (event) => {

        navigate(-1);

    }

    const handleLikeButtonClick = (event) => {

        loggedAPI.put("/api/set-like/" + record_uuid).then(response => {
            setLikesData(prev => ({...response.data.result}));
        }).catch(error => {
            console.error(error.response.data.message);
        })

    }


    // Выполняется перед загрузкой страницы
    useEffect(() => {

        axios.get("/api/get-specific-image/" + record_uuid).then(response => {
            setImageData(response.data);
            setLikesData(prev => ({...response.data.likes}));
        }).catch(error => {
            console.error('Ошибка: Не удалось получить данные изображения (Код 01)');
        })



    }, []);


    return (<>

        <Typography variant="h5">Страница детального просмотра изображений</Typography>

        <Box sx={ pageStyles.wrapper }>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleReturnBackClick}
            >
              Назад
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: "2", }}>
                <IconButton color={ likesData.isLiked ? "error" : "default" } onClick={handleLikeButtonClick}>
                  { likesData.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
                </IconButton>
                <Typography variant="body1">{ likesData.likesCount }</Typography>
            </Box>

            <Stack direction="row" spacing={2}>
                {

                imageData.tags?.length === 0 ? (
                  <Alert severity="warning"><Typography variant="body1"> Ни один тег не был привязан к данному изображению </Typography></Alert>
                )

                :

                imageData.tags?.map((tag,) => {

                    return (<ImageTag tag_slug={tag.tag_slug} tag_name={tag.tag_name} key={tag.tag_uuid} />);

                    }
                )

                }
            </Stack>


            <img src={ imageData.image } />
        </Box>

    </>);

}

export default DetailedPage;