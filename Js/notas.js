const listaNotas    = document.getElementById("listaNotas");
const semNotas      = document.getElementById("semNotas");
const overlay       = document.getElementById("modalOverlay");
const notaForm      = document.getElementById("notaForm");
const notaIdInput   = document.getElementById("notaId");
const tituloInput   = document.getElementById("titulo");
const conteudoInput = document.getElementById("conteudo");
const abrirFormBtn  = document.getElementById("abrirFormBtn");
const cancelarBtn   = document.getElementById("cancelarBtn");
const logoutBtn     = document.getElementById("logoutBtn");
const nomeUsuario   = document.getElementById("nomeUsuario");

// Lista notas do usuário logado
async function renderizarNotas() {
  const resposta = await fetch("../backend/Api/listar_notas.php");

  if (resposta.status === 401) {
    window.location.href = "index.html";
    return;
  }

  const notas = await resposta.json();

  listaNotas.innerHTML = "";
  semNotas.style.display = notas.length === 0 ? "block" : "none";

  notas.forEach(function (nota) {
    const card = document.createElement("div");
    card.classList.add("nota-card");
    card.innerHTML = `
      <h3>${nota.titulo}</h3>
      <p>${nota.conteudo}</p>
      <div class="card-actions">
        <button class="btn-primary" onclick="editarNota(${nota.id})">Editar</button>
        <button class="btn-excluir" onclick="deletarNota(${nota.id})">Excluir</button>
      </div>
    `;
    listaNotas.appendChild(card);
  });
}

// Salva nota nova
async function salvarNota(titulo, conteudo) {
  await fetch("https://sistema-de-notas-production-1398.up.railway.app/backend/Api/salvar_nota.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, conteudo }),
  });

  renderizarNotas();
}

// Editar nota
async function editarNota(id) {
  const resposta = await fetch("https://sistema-de-notas-production-1398.up.railway.app/backend/Api/listar_notas.php");
  const notas    = await resposta.json();
  const nota     = notas.find((n) => n.id === id);
  if (!nota) return;

  notaIdInput.value   = nota.id;
  tituloInput.value   = nota.titulo;
  conteudoInput.value = nota.conteudo;
  overlay.classList.remove("hidden");
  tituloInput.focus();
}

// Deletar nota
async function deletarNota(id) {
  if (!confirm("Deseja excluir esta nota?")) return;

  await fetch("https://sistema-de-notas-production-1398.up.railway.app/backend/Api/deletar_nota.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  renderizarNotas();
}

// Submit do formulário
notaForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const id      = notaIdInput.value;
  const titulo  = tituloInput.value.trim();
  const conteudo = conteudoInput.value.trim();

  if (!titulo || !conteudo) {
    alert("Preencha título e conteúdo.");
    return;
  }

  if (id) {
    await fetch("https://sistema-de-notas-production-1398.up.railway.app/backend/Api/editar_nota.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, titulo, conteudo }),
    });
  } else {
    await salvarNota(titulo, conteudo);
  }

  overlay.classList.add("hidden");
  notaForm.reset();
  renderizarNotas();
});

// Abrir formulário (modal)
abrirFormBtn.addEventListener("click", function () {
  notaIdInput.value   = "";
  tituloInput.value   = "";
  conteudoInput.value = "";
  overlay.classList.remove("hidden");
  tituloInput.focus();
});

// Fechar modal pelo botão cancelar
cancelarBtn.addEventListener("click", function () {
  overlay.classList.add("hidden");
  notaForm.reset();
});

// Fechar modal clicando fora
overlay.addEventListener("click", function (e) {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
    notaForm.reset();
  }
});

// Logout
logoutBtn.addEventListener("click", async function () {
  await fetch("https://sistema-de-notas-production-1398.up.railway.app+++++++++++++++++++++++++++++++++++++++/backend/Api/logout.php");
  window.location.href = "index.html";
});

// Inicia
renderizarNotas();