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
    if (!carrinho.length) return;

    const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
    pedidos.unshift({
        numero: pedidos.length + 1,
        data: new Date().toLocaleDateString('pt-BR'),
        itens: carrinho,
        total: total
    });
    localStorage.setItem('lura_pedidos', JSON.stringify(pedidos));

    carrinho = [];
    atualizarCarrinho();
    renderizarPedidos();
}


function renderizarPedidos() {
    const grade = document.getElementById('repetirgrade');
    if (!grade) return;

    grade.innerHTML = pedidos.length ? '' : '<p id="carrinhovazio">Você ainda não fez nenhum pedido.</p>';
    pedidos.forEach((pedido, i) => {
        grade.innerHTML += `
            <div id="repetir">
                <div>
                    <h3>PEDIDO #${pedido.numero}</h3>
                    <span id="textocinza">${pedido.data} - ${pedido.itens.map(item => item.quantidade + 'x ' + item.nome).join(', ')}</span>
                    <p>${formatarPreco(pedido.total)}</p>
                    <button id="botaodourado" onclick="pedirDeNovo(${i})">Pedir de novo</button>
                </div>
                <img src="${pedido.itens[0].imagem}" alt="${pedido.itens[0].nome}">
            </div>`;
    });
}


function pedirDeNovo(i) {
    pedidos[i].itens.forEach(item => {
        for (let q = 0; q < item.quantidade; q++) adicionarAoCarrinho(item.nome, item.preco, item.imagem);
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
    if (localStorage.getItem('lura_usuario')) location.href = 'perfil.html';
    else abrirModalAuth('login');
}

function atualizarBotoesConta() {
    const nome = localStorage.getItem('lura_usuario');
    document.getElementById('nomeusuario').innerText = nome || 'Entrar';

    const cadastro = document.getElementById('botaocadastro');
    if (cadastro) cadastro.style.display = nome ? 'none' : '';
}

function avisar(id, texto, cor) {
    const aviso = document.getElementById(id);
    if (!aviso) return;
    aviso.innerText = texto;
    aviso.style.color = cor || '#B81D13';
}

function emailValido(email) {
    return email.includes('@') && email.includes('.') && email.length >= 6;
}


// mascaras e campos numericos

function somenteNumeros(campo) {
    campo.value = campo.value.replace(/\D/g, '');
}

function mascaraCPF(campo) {
    let v = campo.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    campo.value = v;
}

function mascaraTelefone(campo) {
    let v = campo.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d)(\d{4})$/, '$1-$2');
    campo.value = v;
}

function mascaraCEP(campo) {
    const v = campo.value.replace(/\D/g, '').slice(0, 8);
    campo.value = v.replace(/(\d{5})(\d)/, '$1-$2');
}


function entrar(nome){
    localStorage.setItem('lura_usuario', nome);
    atualizarBotoesConta();
    fecharModalAuth();
}

function executarLogin(e){
    e.preventDefault();
    const email = document.getElementById('loginemail').value.trim();
    const senha = document.getElementById('loginsenha').value;

    if (!emailValido(email)) return avisar('avisologin', 'Digite um e-mail válido.');
    if (senha.length < 6) return avisar('avisologin', 'A senha precisa ter pelo menos 6 caracteres.');

    const dados = JSON.parse(localStorage.getItem('lura_dados')) || {};
    entrar(dados.email === email ? dados.nome.split(' ')[0] : email.split('@')[0]);
}


function executarCadastro(e) {
    e.preventDefault();
    const dados = {
        nome: document.getElementById('cadnome').value.trim(),
        email: document.getElementById('cademail').value.trim(),
        cpf: document.getElementById('cadcpf').value,
        telefone: document.getElementById('cadtelefone').value
    };
    const senha = document.getElementById('cadsenha').value;
    const confirma = document.getElementById('cadconfirmasenha').value;

    if (dados.nome.length < 3) return avisar('avisocadastro', 'Digite seu nome completo.');
    if (!emailValido(dados.email)) return avisar('avisocadastro', 'Digite um e-mail válido.');
    if (dados.cpf.length !== 14) return avisar('avisocadastro', 'Digite o CPF completo.');
    if (dados.telefone.length < 14) return avisar('avisocadastro', 'Digite o telefone completo com DDD.');
    if (senha.length < 6) return avisar('avisocadastro', 'A senha precisa ter pelo menos 6 caracteres.');
    if (senha !== confirma) return avisar('avisocadastro', 'As senhas não são iguais.');

    localStorage.setItem('lura_dados', JSON.stringify(dados));
    entrar(dados.nome.split(' ')[0]);
}


// pagina de perfil

const camposPerfil = ['nome', 'email', 'cpf', 'telefone', 'cep', 'endereco', 'numero'];

function carregarPerfil() {
    const dados = JSON.parse(localStorage.getItem('lura_dados')) || {};
    camposPerfil.forEach(campo => {
        document.getElementById('perfil' + campo).value = dados[campo] || '';
    });

    document.getElementById('perfilpedidos').innerText = pedidos.length;
    document.getElementById('perfilgasto').innerText = formatarPreco(pedidos.reduce((soma, pedido) => soma + pedido.total, 0));

    if (!localStorage.getItem('lura_usuario')) {
        avisar('avisoperfil', 'Você não está logado. Preencha seus dados e salve para criar sua conta.');
        document.getElementById('botaosair').style.display = 'none';
    }
}

function salvarPerfil(e) {
    e.preventDefault();
    const dados = {};
    camposPerfil.forEach(campo => {
        dados[campo] = document.getElementById('perfil' + campo).value.trim();
    });

    if (dados.nome.length < 3) return avisar('avisoperfil', 'Digite seu nome completo.');
    if (!emailValido(dados.email)) return avisar('avisoperfil', 'Digite um e-mail válido.');
    if (dados.cpf.length !== 14) return avisar('avisoperfil', 'Digite o CPF completo.');
    if (dados.telefone.length < 14) return avisar('avisoperfil', 'Digite o telefone completo com DDD.');
    if (dados.cep && dados.cep.length !== 9) return avisar('avisoperfil', 'Digite o CEP completo.');

    localStorage.setItem('lura_dados', JSON.stringify(dados));
    localStorage.setItem('lura_usuario', dados.nome.split(' ')[0]);
    atualizarBotoesConta();
    document.getElementById('botaosair').style.display = '';
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
