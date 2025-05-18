const API_AUTH = "https://reqres.in/api/login";
const API_WEATHER = "https://api.openweathermap.org/data/2.5/weather?q=Moscow&units=metric&appid=73f1d39815e5449d42d6eaf6ad2a1431&lang=ru";

// Проверяем, авторизован ли пользователь
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (token) {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("weather").style.display = "block";
        fetchWeather();
    }
});

// Функция входа
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("error");

    // Проверка заполнения полей
    if (!email || !password) {
        errorElement.textContent = "Заполните email и пароль";
        return;
    }

    try {
        const response = await fetch(API_AUTH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "reqres-free-v1"
            },
            body: JSON.stringify({
                email: "eve.holt@reqres.in",  // Фиксированный тестовый email
                password: "cityslicka"         // Фиксированный тестовый пароль
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Ошибка сервера");
        }

        localStorage.setItem("token", data.token);
        document.getElementById("login-form").style.display = "none";
        document.getElementById("weather").style.display = "block";
        fetchWeather();

    } catch (error) {
        errorElement.textContent = "Ошибка: " + error.message;
        console.error("Детали ошибки:", error);
    }
}

// Функция выхода
function logout() {
    localStorage.removeItem("token");
    document.getElementById("login-form").style.display = "block";
    document.getElementById("weather").style.display = "none";
}

// Получение погоды
async function fetchWeather() {
    try {
        const response = await fetch(API_WEATHER);
        const data = await response.json();
        
        if (data.cod === 401) {
            throw new Error("Неверный API-ключ. Проверь ключ на OpenWeatherMap.");
        }
        if (!response.ok) {
            throw new Error(data.message || "Ошибка загрузки погоды");
        }
        
        document.getElementById("temp").textContent = Math.round(data.main.temp);
        document.getElementById("conditions").textContent = data.weather[0].description;
        document.getElementById("wind").textContent = data.wind.speed;
    } catch (error) {
        console.error("Ошибка:", error);
        document.getElementById("conditions").textContent = error.message;
    }
}