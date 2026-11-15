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

document.addEventListener("DOMContentLoaded", () => {
    atualizarIconeTema();
    atualizarCarrinho();
    document.getElementById('nomeusuario').innerText = localStorage.getItem('lura_usuario') || 'Entrar';

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
    document.getElementById('iconetema').innerHTML = escuro
        ? '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"></path>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
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
                 <button id="botaodourado" onclick="adicionarProduto(${p.id})">Adicionar +</button>
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
    carrinho = [];
    atualizarCarrinho();
}


 function abrirModalAuth() {
    document.getElementById('janelalogin').style.display = 'flex';
  alternarFormAuth('login');
}


function fecharModalAuth() {
    document.getElementById('janelalogin').style.display = 'none';
}

function alternarFormAuth(tipo) {
    document.getElementById('formlogin').style.display = tipo === 'login' ? 'block' : 'none';
    document.getElementById('formcadastro').style.display = tipo === 'cadastro' ? 'block' : 'none';
}

function entrar(nome){
    if (nome) {
        localStorage.setItem('lura_usuario', nome);
        document.getElementById('nomeusuario').innerText = nome;
    }
    fecharModalAuth();
}

function executarLogin(e){
    e.preventDefault();
    entrar(document.getElementById('loginemail').value.split('@')[0]);
}


function executarCadastro(e) {
    e.preventDefault();
    entrar(document.getElementById('cadnome').value);
}


function enviarContato(e){
    e.preventDefault();
    e.target.reset();
}



