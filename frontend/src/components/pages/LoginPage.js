import React, { useState, useEffect } from 'react';

import axios from 'axios';

// mui-компоненты
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function LoginPage() {

    // Введение csrf-токена в отправку запросов
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    // Выполняется перед загрузкой страницы
    useEffect(() => {

    }, []);

    return (<>
        <Typography variant="h5">Страница входа в профиль</Typography>
    </>);

}

export default LoginPage;