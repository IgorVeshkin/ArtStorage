import React, { useState, useEffect } from 'react';

import axios from 'axios';

// mui-компоненты
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Link, useLocation, useNavigate } from "react-router-dom";

import "./MainPage.styles.css";


function MainPage() {

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const pageNumber = parseInt(queryParams.get("page")) || 1;

    const [message, setMessage] = useState('Сообщение не было получено!');
    const [imagesList, setImagesList] = useState([]);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const [page, setPage] = useState(pageNumber);
    const [imageCount, setImageCount] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    // Нужно для отправки запросом на сервер (кроме GET, он и без этого работает)
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';


    const handlePageChange = (event, value) => {

        setPage(value);

    }


    const fetchImages = async (pageNumber) => {

        setIsImageLoading(true);

        try {

            const response = await axios.get("/api/get-images/?current_page=" + pageNumber);

            setImagesList(response.data.result);
            setImageCount(response.data.totalCount);
            setPageSize(response.data.pageSize);

            setIsImageLoading(false);

        } catch (error) {

            console.error(error);

        }

    }


    // Выполняется перед загрузкой страницы
    useEffect(() => {

        setIsImageLoading(true);

        axios.get("/api/basic-response/").then(response => {
            setMessage(response.data.message);
        })

        axios.get("/api/get-images/?current_page=" + page).then(response => {
            setImagesList(response.data.result);
            setPageSize(response.data.pageSize);
            setImageCount(response.data.totalCount);

            setIsImageLoading(false);
        })


    }, []);


    useEffect(() => {

        const updatedQueryParams = new URLSearchParams(location.search);

        updatedQueryParams.set("page", page);

        navigate(`${location.pathname}?${updatedQueryParams.toString()}`)

        fetchImages(page);

    }, [page]);


    return (<>

               <Typography variant="h5"> {message} </Typography>

               <Stack>

                    { isImageLoading ? <CircularProgress /> :

                        imagesList.map((record, index) => {

                            return (
                                <Box sx={{  }} key={record.uuid} >
                                    <Typography variant='body1'>Uploaded by: {record.loaded_by.username}</Typography>
                                    <Typography variant='body1'>Uploaded at: {record.create_date}</Typography>
                                    <Typography variant='body1'>Likes: {record.likes.likesCount}</Typography>

                                    <Link to={record.originURL}>
                                        <img src={record.image} style={{ width: '400px', }} />
                                    </Link>

                                </Box>
                            )

                        })

                    }


                    <Pagination
                        count={Math.ceil(imageCount / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />

               </Stack>

               <Box className="images-container" sx={{ width: '90%' }}>
                   { isImageLoading ? <CircularProgress /> :
                            imagesList.map((record, index) => {

                                return (
                                <Link to={record.originURL} key={ record.uuid } style={{ textDecoration: "none", color: "inherit", }}>
                                       <Box className="image-item">
                                           <img src={ record.image } style={{ width: "100%", height: "100%", objectFit: "contain", }} />

                                          <Stack direction="row" spacing={0.5}>
                                            <Typography variant="body1" color="textPrimary" >{ record.likes.likesCount }</Typography>
                                            <FavoriteIcon color="error" />
                                          </Stack>
                                       </Box>
                                </Link>

                                )

                            })
                   }

                   <Box className="empty-image" key="empty-image-1">
                   </Box>

                   <Box className="empty-image" key="empty-image-2">
                   </Box>

                   <Box className="empty-image" key="empty-image-3">
                   </Box>


               </Box>

    </>);

}

export default MainPage;