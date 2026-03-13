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

import ImageTag from "../items/ImageTag.jsx";
import TagsAutoComplete from "../items/TagsAutoComplete.jsx";

import useFetchTags from "../hooks/useFetchTags.jsx";


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


    const changeTagsList = (updatedTags) => {
        setTags(updatedTags);
    }

    const changePage = (newPage) => {
        setPage(newPage);
    }


    const { tagsData, tagsLoading, tagsError } = useFetchTags(queryParams.get("tags") || "", changeTagsList);

    // Функция для добавления нового тега на страницу, если его не было раньше
    const assembleTagsWhileSearching = (newTag) => {
      const tagsArray = tags ? tags.split(",").map(s => s.trim()).filter(Boolean) : [];

      if (!tagsArray.includes(newTag)) {
        tagsArray.push(newTag);
      }

      setTags(tagsArray.join(","));

      // По умолчанию указываю первую страницу, так как при добавлении тега пагинация сбрасывается
      setPage(1);
}


    const handlePageChange = (event, value) => {

        setPage(value);

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


    return (<Box className="main-container">

               <Box className="tag-search-auto-complete-box" sx={{ mt: 2, }}>
                    <TagsAutoComplete onSelect={assembleTagsWhileSearching} />
               </Box>

               <Stack direction="row" spacing={2} sx={{ padding: '1rem 0 1rem 1rem', }}>
                   { !tagsLoading && tagsData?.map((tag,) => {
                        return (<ImageTag
                                tag_slug={tag.title_slug}
                                tag_name={tag.title}
                                displayOnly={true}
                                queryParamsChangeManager={{
                                    changeTagsList: changeTagsList,
                                    changePage: changePage
                                }}
                                key={"tag_" + tag.uuid} />);

                   })  }
               </Stack>

               <Box className="img-container-wrapper">

                    <Box className="img-container">
                       { isImageLoading ? <CircularProgress /> :
                                imagesList.map((record, index) => {

                                    return (
                                    <Link className="img-link-item" to={record.originURL} key={ record.uuid } style={{ textDecoration: "none", color: "inherit", }}>

                                           <img src={ record.image } />

                                           <Box className="heart-count-img-icon">
                                                <Typography variant="body1" color="textPrimary" >{ record.likes.likesCount }</Typography>
                                                <FavoriteIcon color="error" />
                                          </Box>
                                    </Link>

                                    )

                                })
                       }
                    </Box>


                    <Pagination
                        count={Math.ceil(imageCount / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ my: 1, }}
                    />

               </Box>

    </Box>);

}

export default MainPage;