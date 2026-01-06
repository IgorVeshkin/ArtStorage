import React, { useState, useEffect, useRef } from 'react';

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

import ImageTag from "../items/ImageTag.jsx"


function MainPage() {

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);

    const [message, setMessage] = useState('Сообщение не было получено!');
    const [imagesList, setImagesList] = useState([]);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const [page, setPage] = useState(parseInt(queryParams.get("page")) || 1);
    const [imageCount, setImageCount] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const [tags, setTags] = useState(queryParams.get("tags") || "");

    const prevPage = useRef(parseInt(queryParams.get("page")) || 1);
    const prevTags = useRef(queryParams.get("tags") || "");

    // Нужно для отправки запросом на сервер (кроме GET, он и без этого работает)
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';


    const handlePageChange = (event, value) => {

        setPage(value);

        queryParams.set("page", value);

    }


    const fetchImages = async () => {

        setIsImageLoading(true);

        try {

            const customQueryParams = queryParams;

            // Если переданы параметр "?tags=", то исключаю параметр
            if (tags === "") {
                customQueryParams.delete("tags");
            }

            const response = await axios.get("/api/get-images/?" + customQueryParams.toString());

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


    }, []);


    useEffect(() => {

        const pageChanged = prevPage.current !== page;
        const tagsChanged = prevTags.current !== tags;

        prevPage.current = page;
        prevTags.current = tags;


        if (tagsChanged) {

            queryParams.set('tags', tags);
            queryParams.set('page', 1);

        } else if (pageChanged) {

            queryParams.set('page', page);

          }

        navigate(`${location.pathname}?${queryParams.toString()}`);
        fetchImages();


    }, [page, tags]);


    return (<>

               <Typography variant="h5"> {message} </Typography>

               <Stack direction="row" spacing={2} sx={{ padding: '10px 0 10px 0', }}>
                { tags != null && tags !== "" && tags.split(",").map((tag,) => {

                        return (<ImageTag
                                tag_slug={tag}
                                tag_name={tag}
                                displayOnly={true}
                                queryParamsChangeManager={{
                                    changeTagsList: setTags,
                                    changePage: setPage
                                }}
                                key={"tag_" + tag} />);

                }) }
               </Stack>

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