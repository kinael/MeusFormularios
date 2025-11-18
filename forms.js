// forms.js

const AUTH_KEY = "formsAuthJaque";
const STORAGE_KEY = "formsLinksJaque";

let links = [];
let editandoId = null; // armazena o ID do item que está em edição

document.addEventListener("DOMContentLoaded", function () {
  // Proteção de rota: só entra se estiver autenticado
  const auth = localStorage.getItem(AUTH_KEY);
  if (auth !== "ok") {
    window.location.href = "login.html";
    return;
  }

  // Elementos
  const btnLogout = document.getElementById("btnLogout");
  const linkForm = document.getElementById("linkForm");
  const formNameInput = document.getElementById("formName");
  const formUrlInput = document.getElementById("formUrl");
  const formTitle = document.getElementById("formTitle");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnCancelarEdicao = document.getElementById("btnCancelarEdicao");
  const listaVazia = document.getElementById("listaVazia");
  const listaTabelaWrapper = document.getElementById("listaTabelaWrapper");
  const linksTableBody = document.getElementById("linksTableBody");
  const totalFormsBadge = document.getElementById("totalFormsBadge");

  // Logout
  btnLogout.addEventListener("click", function () {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "login.html";
  });

  // Carregar links já salvos
  carregarLinks();
  renderizarLista();

  // Submit do formulário (adicionar ou salvar edição)
  linkForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = formNameInput.value.trim();
    const url = formUrlInput.value.trim();

    if (!nome || !url) {
      return;
    }

    if (editandoId === null) {
      // Adicionando novo
      adicionarLink(nome, url);
    } else {
      // Salvando edição
      atualizarLink(editandoId, nome, url);
    }

    salvarLinks();
    renderizarLista();
    resetarFormulario();
  });

  // Cancelar edição
  btnCancelarEdicao.addEventListener("click", function () {
    resetarFormulario();
  });

  // Funções ----------------------------------------

  function carregarLinks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      links = data ? JSON.parse(data) : [];
      if (!Array.isArray(links)) links = [];
    } catch (err) {
      console.error("Erro ao carregar links:", err);
      links = [];
    }
  }

  function salvarLinks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }

  function adicionarLink(nome, url) {
    const novo = {
      id: Date.now(), // ID simples
      nome: nome,
      url: url
    };
    links.push(novo);
  }

  function atualizarLink(id, nome, url) {
    const index = links.findIndex((item) => item.id === id);
    if (index !== -1) {
      links[index].nome = nome;
      links[index].url = url;
    }
  }

  function removerLink(id) {
    if (!confirm("Deseja realmente remover este formulário?")) return;
    links = links.filter((item) => item.id !== id);
    salvarLinks();
    renderizarLista();
  }

  function iniciarEdicao(id) {
    const link = links.find((item) => item.id === id);
    if (!link) return;

    editandoId = id;
    formNameInput.value = link.nome;
    formUrlInput.value = link.url;

    formTitle.textContent = "Editar formulário";
    btnSalvar.textContent = "Salvar alterações";
    btnCancelarEdicao.classList.remove("d-none");
  }

  function resetarFormulario() {
    editandoId = null;
    linkForm.reset();
    formTitle.textContent = "Adicionar novo formulário";
    btnSalvar.textContent = "Adicionar";
    btnCancelarEdicao.classList.add("d-none");
  }

  function renderizarLista() {
    linksTableBody.innerHTML = "";

    if (!links || links.length === 0) {
      listaVazia.classList.remove("d-none");
      listaTabelaWrapper.classList.add("d-none");
      totalFormsBadge.textContent = "0";
      return;
    }

    listaVazia.classList.add("d-none");
    listaTabelaWrapper.classList.remove("d-none");
    totalFormsBadge.textContent = String(links.length);

    links.forEach((item) => {
      const tr = document.createElement("tr");

      const tdNome = document.createElement("td");
      tdNome.textContent = item.nome;

      const tdLink = document.createElement("td");
const a = document.createElement("a");

// Corrigir automaticamente links sem https://
let href = item.url.trim();
if (!href.startsWith("http://") && !href.startsWith("https://")) {
  href = "https://" + href;
}

a.href = href;
a.target = "_blank";
a.rel = "noopener noreferrer";
a.textContent = item.url;
a.classList.add("small-link");
tdLink.appendChild(a);


      const tdAcoes = document.createElement("td");
      tdAcoes.classList.add("text-end");

      const btnEdit = document.createElement("button");
      btnEdit.className = "btn btn-sm btn-outline-primary me-2";
      btnEdit.textContent = "Editar";
      btnEdit.addEventListener("click", function () {
        iniciarEdicao(item.id);
      });

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn btn-sm btn-outline-danger";
      btnDelete.textContent = "Remover";
      btnDelete.addEventListener("click", function () {
        removerLink(item.id);
      });

      tdAcoes.appendChild(btnEdit);
      tdAcoes.appendChild(btnDelete);

      tr.appendChild(tdNome);
      tr.appendChild(tdLink);
      tr.appendChild(tdAcoes);

      linksTableBody.appendChild(tr);
    });
  }
});
