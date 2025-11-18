// login.js

// Chave usada para saber se está logada
const AUTH_KEY = "formsAuthJaque";

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  // Se já está logada, manda direto pro painel
  const alreadyAuth = localStorage.getItem(AUTH_KEY);
  if (alreadyAuth === "ok") {
    window.location.href = "forms.html";
    return;
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (username === "jaque" && password === "lo080302") {
      // Autenticado
      localStorage.setItem(AUTH_KEY, "ok");
      loginError.classList.add("d-none");
      window.location.href = "forms.html";
    } else {
      // Erro
      loginError.classList.remove("d-none");
    }
  });
});
