import React, { useState, useEffect } from 'react';

import axios from 'axios';

// mui-компоненты
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function LoginPage() {

    // Введение csrf-токена в отправку запросов
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const handleLoginDataChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };


    const handleLogin = (e,) => {
        e.preventDefault();

        console.log(loginData);
    }


    // Выполняется после отрисовки страницы
    useEffect(() => {

    }, []);

    return (<Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 64px)",
            width: "100%",
          }}
        >
        <Stack
            component={"form"}
            onSubmit={handleLogin}
            direction={"column"}

            sx={{
                gap: 2,
                width: 400,
                padding: 2,
                boxShadow: 3,
                borderRadius: 2,
            }}
            >

            <Typography
                variant="h6"
                sx={{ textAlign: 'center', width: '100%' }}
            >
            Вход в профиль
            </Typography>

            <TextField
                value={loginData.username}
                onChange={handleLoginDataChange}
                name="username"
                placeholder="Логин"
                variant="outlined"
                sx={{ m: "0 10px 0 10px", }} />

            <TextField
                value={loginData.password}
                onChange={handleLoginDataChange}
                name="password"
                type="password"
                placeholder="Пароль"
                variant="outlined"
                sx={{ m: "0 10px 0 10px",  }} />


            <Button
                variant="contained"
                color="success"
                type="submit"
                sx={{ m: "0 10px 0 10px", }}
                >
                Войти
            </Button>

        </Stack>

    </Box>);

}

export default LoginPage;