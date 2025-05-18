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

    if (!email || !password) {
        errorElement.textContent = "Заполните email и пароль";
        return;
    }

    try {
        console.log("Отправка запроса на авторизацию..."); // Логирование
        const response = await fetch("https://reqres.in/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "eve.holt@reqres.in",
                password: "cityslicka"
            }),
        });

        console.log("Ответ сервера:", response); // Логирование
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Ошибка сервера");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        
        console.log("Авторизация успешна, токен:", data.token); // Логирование
        
        document.getElementById("login-form").style.display = "none";
        document.getElementById("weather").style.display = "block";
        fetchWeather();

    } catch (error) {
        console.error("Ошибка авторизации:", error);
        errorElement.textContent = "Ошибка: " + error.message;
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
        console.log("Запрос погоды..."); // Логирование
        const API_WEATHER = "https://api.openweathermap.org/data/2.5/weather?q=Moscow&units=metric&appid=73f1d39815e5449d42d6eaf6ad2a1431&lang=ru";
        
        const response = await fetch(API_WEATHER);
        const data = await response.json();
        
        console.log("Ответ OpenWeatherMap:", data); // Логирование
        
        if (data.cod === 401) {
            throw new Error("Неверный API-ключ");
        }
        
        document.getElementById("temp").textContent = Math.round(data.main.temp);
        document.getElementById("conditions").textContent = data.weather[0].description;
        document.getElementById("wind").textContent = data.wind.speed;
        
    } catch (error) {
        console.error("Ошибка запроса погоды:", error);
        document.getElementById("conditions").textContent = "Ошибка: " + error.message;
    }
}