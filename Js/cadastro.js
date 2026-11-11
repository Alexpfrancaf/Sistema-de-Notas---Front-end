const formCadastro = document.getElementById("formCadastro");
const erroCadastro = document.getElementById("erroCadastro");

formCadastro.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome  = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!nome) {
    erroCadastro.textContent = "Preencha o seu nome.";
    return;
  }

  if (!email) {
    erroCadastro.textContent = "Preencha o seu e-mail.";
    return;
  }

  if (!email.includes("@")) {
    erroCadastro.textContent = "Informe um e-mail válido.";
    return;
  }

  if (!senha) {
    erroCadastro.textContent = "Preencha a sua senha.";
    return;
  }

  if (senha.length < 8) {
    erroCadastro.textContent = "A senha deve ter no mínimo 8 caracteres.";
    return;
  }

  try {
    const resposta = await fetch("https://sistema-de-notas-production-1398.up.railway.app/backend/Api/cadastro.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
      credentials: "include"
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      alert("✅ Cadastro realizado com sucesso! Faça login para continuar.");
      window.location.href = "index.html";
    } else {
      erroCadastro.textContent = dados.erro || "Erro ao realizar cadastro.";
    }

  } catch (erro) {
    erroCadastro.textContent = "Erro ao conectar com o servidor.";
    console.error(erro);
  }
});
