import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

// Импорт страниц системы
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import DetailedPage from "./pages/DetailedPage";

import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Главная страница */}
                <Route path="*" element={<MainPage/>} />

                {/* Защищенные пути - Редирект на страницу логина */}
                <Route element={<ProtectedRoute />}>

                    {/* Детальный просмотр изображения */}
                    <Route path="image/:record_uuid" element={<DetailedPage/>} />

                </Route>

                {/* Логин */}
                <Route path="login" element={<LoginPage/>} />


            </Routes>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById('app');
const root = ReactDOM.createRoot(rootElement);

// Рендер приложения
root.render(<App/>);
