if (localStorage.getItem('lura_theme') === 'dark') {
    document.documentElement.id = 'escuro';
}

const produtosData = [
  { id: 1, nome: "HAMBURGUER", sub: "Lura Bacon Supreme", categoria: "hamburgueres", preco: 30, imagem: "baconsupreme.jpg" },
    { id: 2, nome: "HAMBURGUER", sub: "Smash Double Cheese", categoria: "hamburgueres", preco: 30, imagem: "smashdouble.jpg" },
    { id: 3, nome: "HAMBURGUER", sub: "Cheddar Bacon Craft", categoria: "hamburgueres", preco: 35, imagem: "cheddarbacon.jpg" },
    { id: 4, nome: "HAMBURGUER", sub: "Combo Lura Duplo + Batata", categoria: "combos", preco: 42, imagem: "combo.jpg" },
       { id: 5, nome: "PORÇÃO", sub: "Porção de Batata Rústica", categoria: "porcoes", preco: 22, imagem: "batata.jpg" },
    { id: 6, nome: "BEBIDA", sub: "Coca-Cola", categoria: "bebidas", preco: 10, imagem: "cocacola.jpg" }
];

let carrinho = JSON.parse(localStorage.getItem('lura_carrinho')) || [
    { nome: "LURA BACON BURGER", preco: 30, quantidade: 1, imagem: "baconsupreme.jpg" },
    { nome: "SMASH DOUBLE CHEESE", preco: 30, quantidade: 1, imagem: "smashdouble.jpg" }
];
carrinho = carrinho.filter(item => item.preco > 0 && item.quantidade > 0);

let pedidos = JSON.parse(localStorage.getItem('lura_pedidos')) || [
    { numero: 2, data: '10/11/2026', itens: [{ nome: "SMASH DOUBLE CHEESE", preco: 30, quantidade: 1, imagem: "smashdouble.jpg" }], total: 30 },
    { numero: 1, data: '05/11/2026', itens: [{ nome: "LURA BACON BURGER", preco: 30, quantidade: 1, imagem: "baconsupreme.jpg" }], total: 30 }
];

document.addEventListener("DOMContentLoaded", () => {
  atualizarIconeTema();
    atualizarCarrinho();
    atualizarBotoesConta();
    renderizarPedidos();
    if (document.getElementById('perfilform')) carregarPerfil();

      if (document.getElementById('produtos')) {
          const termo = new URLSearchParams(location.search).get('q');
          document.getElementById('campopesquisa').value = termo || '';
       filtrarProdutos();
  }
});

function formatarPreco(valor){
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  }

function toggleDarkMode() {
 const html = document.documentElement;
      html.id = html.id === 'escuro' ? '' : 'escuro';
      localStorage.setItem('lura_theme', html.id === 'escuro' ? 'dark' : 'light');
    atualizarIconeTema();
}
function atualizarIconeTema(){
     const escuro = document.documentElement.id === 'escuro';
    document.getElementById('iconetema').src = escuro ? 'sol.png' : 'lua.png';
    document.getElementById('iconetemamenu').innerText = escuro ? '☀️' : '🌙';
}


 function toggleDrawer(abrir) {
     document.getElementById('menu').style.left = abrir ? '0px' : '-320px';
     document.getElementById('fundomenu').style.display = abrir ? 'block' : 'none';
}




function fecharDrawer() {
   toggleDrawer(false);
}

function renderizarProdutos(lista){
    const produtos = document.getElementById('produtos');
    produtos.innerHTML = lista.length ? '' : '<p id="avisovazio">Nenhum produto encontrado.</p>';

    lista.forEach(p => {
        produtos.innerHTML += `
            <div id="produto">
                <h3>${p.nome}</h3>
                <div id="produtoimagem"><img src="${p.imagem}" alt="${p.sub}"></div>
                 <p id="produtonome">${p.sub}</p>
                <p id="produtopreco">${formatarPreco(p.preco)}</p>
                 <button id="botaodourado" onclick="adicionarProduto(${p.id})">Adicionar </button>

             </div>`;
   });
}

function filtrarCategoria(cat, botao) {
    document.querySelectorAll('#categoriaativa').forEach(b => b.id = 'categoria');
    botao.id = 'categoriaativa';
  renderizarProdutos(cat === 'todos' ? produtosData : produtosData.filter(p => p.categoria === cat));
}

function filtrarProdutos(event) {
    const termo = document.getElementById('campopesquisa').value.toLowerCase().trim();
    if (!document.getElementById('produtos')){
        if (event.key === 'Enter' && termo) location.href = 'index.html?q=' + encodeURIComponent(termo);

        return;
    }

    renderizarProdutos(produtosData.filter(p => (p.nome + ' ' + p.sub).toLowerCase().includes(termo)));
}

function atualizarCarrinho(){
      localStorage.setItem('lura_carrinho', JSON.stringify(carrinho));
  document.getElementById('contadorcarrinho').innerText = carrinho.reduce((soma, item) => soma + item.quantidade, 0);

    const itens = document.getElementById('itenscarrinho');
    if (!itens) return;

    itens.innerHTML = carrinho.length ? '' : '<p id="carrinhovazio">Seu carrinho está vazio.</p>';
    carrinho.forEach((item, i) => {
        itens.innerHTML += `
            <div id="itemcarrinho">
                <div id="iteminfo">
                     <img src="${item.imagem}" alt="${item.nome}">
                      <div>
                        <h3>${item.nome}</h3>
                      <p>${formatarPreco(item.preco)}</p>
                    </div>
                 </div>
                <div id="itemqtd">

                    <span>QNT</span>
                    <div id="quantidade">
                         <button onclick="mudarQtd(${i}, -1)">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="mudarQtd(${i}, 1)">+</button>
                   </div>
              </div>
            </div>`;
    });

    document.getElementById('valortotal').innerText = formatarPreco(carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0));
}

function mudarQtd(i, valor){
      carrinho[i].quantidade += valor;
      if (carrinho[i].quantidade <= 0) carrinho.splice(i, 1);
    atualizarCarrinho();
}



  function adicionarAoCarrinho(nome, preco, imagem) {
     const item = carrinho.find(i => i.nome === nome);
    if (item) item.quantidade++;
    else carrinho.push({ nome, preco, quantidade: 1, imagem });
    atualizarCarrinho();
}

function adicionarProduto(id) {

    const p = produtosData.find(p => p.id === id);
    adicionarAoCarrinho(p.sub, p.preco, p.imagem);
}

function finalizarCompra() {
    if (!carrinho.length) return;
     pedidos.unshift({ numero: pedidos.length + 1, data: new Date().toLocaleDateString('pt-BR'), itens: carrinho, total: carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0) });
      localStorage.setItem('lura_pedidos', JSON.stringify(pedidos));
    carrinho = [];
    atualizarCarrinho();
      renderizarPedidos();
}

function renderizarPedidos() {
    const grade = document.getElementById('pedidosgrade');
    if (!grade) return;

      grade.innerHTML = pedidos.length ? '' : '<p id="carrinhovazio">Você ainda não fez nenhum pedido.</p>';

    pedidos.forEach(p => {
         grade.innerHTML += `
            <div id="repetir">
                <div>
                    <h3>PEDIDO #${p.numero}</h3>
                     <span id="textocinza">${p.data} - ${p.itens.map(item => item.quantidade + 'x ' + item.nome).join(', ')}</span>
                    <p>${formatarPreco(p.total)}</p>
                </div>
                <img src="${p.itens[0].imagem}" alt="${p.itens[0].nome}">
            </div>`;
    });

    const repetir = document.getElementById('repetirgrade');
    repetir.innerHTML = '';
   new Map(pedidos.flatMap(p => p.itens).map(item => [item.nome, item])).forEach(item => {
        repetir.innerHTML += `
           <div id="repetir">
               <div>
                    <h3>${item.nome}</h3>
                     <p>${formatarPreco(item.preco)}</p>
                    <button id="botaodourado" onclick="adicionarAoCarrinho('${item.nome}', ${item.preco}, '${item.imagem}')">Pedir de novo</button>
                  </div>

                <img src="${item.imagem}" alt="${item.nome}">
            </div>`;
    });
}


function abrirModalAuth(tipo) {
      document.getElementById('janelalogin').style.display = 'flex';
    alternarFormAuth(tipo || 'login');
}


function fecharModalAuth() {
    document.getElementById('janelalogin').style.display = 'none';

}
function alternarFormAuth(tipo) {
    document.getElementById('formlogin').style.display = tipo === 'login' ? 'block' : 'none';
    document.getElementById('formcadastro').style.display = tipo === 'cadastro' ? 'block' : 'none';
   avisar('avisologin', '');
     avisar('avisocadastro', '');
}

function minhaConta() {
      localStorage.getItem('lura_usuario') ? location.href = 'perfil.html' : abrirModalAuth('login');
}

function atualizarBotoesConta() {
    const nome = localStorage.getItem('lura_usuario');
  document.getElementById('nomeusuario').innerText = nome || 'Entrar';
      if (document.getElementById('botaocadastro')) document.getElementById('botaocadastro').style.display = nome ? 'none' : '';
}

function avisar(id, texto, cor) {
    const aviso = document.getElementById(id);
    if (!aviso) return;
   aviso.innerText = texto;
      aviso.style.color = cor || '#B81D13';
}
function valor(id) {
    return document.getElementById(id).value.trim();
}

function emailValido(email) {
    return email.includes('@') && email.includes('.') && email.length >= 6;
}
function validarDados(d, aviso) {
    const erro = d.nome.length < 3 ? 'Digite seu nome completo.'
        : !emailValido(d.email) ? 'Digite um e-mail válido.'
          : d.cpf.length !== 14 ? 'Digite o CPF completo.'
        : d.telefone.length < 14 ? 'Digite o telefone completo com DDD.'
      : d.cep.length !== 9 ? 'Digite o CEP completo.'
      : d.endereco.length < 3 ? 'Digite seu endereço.'
        : !d.numero ? 'Digite o número da casa.' : '';
  avisar(aviso, erro);
   return !erro;

}

function somenteNumeros(campo) {
     campo.value = campo.value.replace(/\D/g, '');
}

function mascaraCPF(campo) {
    campo.value = campo.value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascaraTelefone(campo) {
     campo.value = campo.value.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');
}

function mascaraCEP(campo) {
  campo.value = campo.value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

function entrar(nome){
    localStorage.setItem('lura_usuario', nome);
  atualizarBotoesConta();
    fecharModalAuth();
    if (document.getElementById('perfilform')) carregarPerfil();
}
function executarLogin(e){
    e.preventDefault();
    const email = valor('loginemail');
    const dados = JSON.parse(localStorage.getItem('lura_dados')) || {};

   if (!emailValido(email)) return avisar('avisologin', 'Digite um e-mail válido.');
    if (document.getElementById('loginsenha').value.length < 6) return avisar('avisologin', 'A senha precisa ter pelo menos 6 caracteres.');
    entrar(dados.email === email ? dados.nome.split(' ')[0] : email.split('@')[0]);
}


function executarCadastro(e) {
     e.preventDefault();
    criarConta('cad', 'avisocadastro');
}
function criarConta(prefixo, aviso) {
    const dados = lerDados(prefixo);
    const senha = document.getElementById(prefixo + 'senha').value;

  if (!validarDados(dados, aviso)) return false;
      if (senha.length < 6) return avisar(aviso, 'A senha precisa ter pelo menos 6 caracteres.');
    if (senha !== document.getElementById(prefixo + 'confirmasenha').value) return avisar(aviso, 'As senhas não são iguais.');

    localStorage.setItem('lura_dados', JSON.stringify(dados));
    entrar(dados.nome.split(' ')[0]);
    return true;
}


const campos = ['nome', 'email', 'cpf', 'telefone', 'cep', 'endereco', 'numero'];

function lerDados(prefixo) {
  const dados = {};
     campos.forEach(c => dados[c] = valor(prefixo + c));
     return dados;
}

function carregarPerfil() {
    const logado = localStorage.getItem('lura_usuario');
    const dados = logado ? JSON.parse(localStorage.getItem('lura_dados')) || {} : {};

    campos.forEach(c => document.getElementById('perfil' + c).value = dados[c] || '');
     document.getElementById('perfilpedidos').innerText = pedidos.length;

    document.getElementById('perfiltitulo').innerText = logado ? 'Meus Dados' : 'Criar Conta';
    document.getElementById('perfilbotao').innerText = logado ? 'Salvar Dados' : 'Criar Conta';
     document.getElementById('perfilsenhas').style.display = logado ? 'none' : '';

    document.getElementById('botaosair').style.display = logado ? '' : 'none';
}

function salvarPerfil(e) {
    e.preventDefault();
    if (!localStorage.getItem('lura_usuario')) {
        if (criarConta('perfil', 'avisoperfil')) avisar('avisoperfil', 'Conta criada com sucesso!', '#16A34A');
        return;
    }

  const dados = lerDados('perfil');
    if (!validarDados(dados, 'avisoperfil')) return;
    localStorage.setItem('lura_dados', JSON.stringify(dados));
      entrar(dados.nome.split(' ')[0]);
    avisar('avisoperfil', 'Dados salvos com sucesso!', '#16A34A');
}

function sairConta() {
    localStorage.removeItem('lura_usuario');
    location.href = 'index.html';
}


function enviarContato(e){
  e.preventDefault();
   e.target.reset();
}



fetch("http://localhost:5000/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        customer_name: "Lucas Andrade",
        order_date: new Date().toISOString().slice(0, 19),
        total_amount: 56.30,
        status: "Pendente"
    })
});


fetch("http://localhost:5000/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: nomeDaConta })
});
