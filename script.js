// Variável global para armazenar todos os dados carregados
let todosProdutos = []; 
// Variável global para simular o carrinho de compras
let carrinho = [];
const cardContainer = document.getElementById('card-container');
const carrinhoCountElement = document.getElementById('carrinho-count'); // Novo elemento

// 1. Função para carregar os dados E o carrinho
async function carregarDados() {
    const catalogoSalvo = localStorage.getItem('catalogoFarmacia');
    
    if (catalogoSalvo) {
        // ✅ Se houver catálogo salvo (com estoque atualizado), usa ele
        todosProdutos = JSON.parse(catalogoSalvo);
    } else {
        // Se for a primeira vez, carrega do JSON e salva o original
        try {
            const resposta = await fetch("produtos.json");
            if (!resposta.ok) {
                throw new Error(`Erro ao carregar o JSON: ${resposta.status}`);
            }
            todosProdutos = await resposta.json();
            salvarEstoque(); // Salva a versão original pela primeira vez
        } catch (erro) {
            console.error("Erro no carregamento de dados:", erro);
            cardContainer.innerHTML = "<p>Não foi possível carregar o catálogo de produtos.</p>";
            // Se não carregar, paramos a execução
            return; 
        }
    }
    
    // 🚀 Carrega o carrinho salvo do localStorage (Essa parte estava correta)
    const carrinhoSalvo = localStorage.getItem('carrinhoFarmacia');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
    }
    
    // Renderiza o catálogo (agora com o estoque correto)
    renderizarCards(todosProdutos); 
    atualizarContagemCarrinho(); // Atualiza a contagem
    atualizarMetricsEstoque();
}
// Função auxiliar para salvar o carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinhoFarmacia', JSON.stringify(carrinho));
}

// 🚀 MELHORIA 1: Função para atualizar a contagem de itens no carrinho
function atualizarContagemCarrinho() {
    if (carrinhoCountElement) {
        carrinhoCountElement.textContent = carrinho.length;
    }
}

// 2. Função para renderizar os cards no DOM
function renderizarCards(dadosParaRenderizar) {
    cardContainer.innerHTML = ''; 

    if (dadosParaRenderizar.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum produto encontrado com o termo pesquisado.</p>";
        return;
    }

    for (const produto of dadosParaRenderizar) {
        
        const article = document.createElement("article");
        article.classList.add("card");
        
        // Determina se o produto está esgotado
        const esgotado = produto.estoque <= 0;
        
        article.innerHTML = `
            <h2>${produto.nome}</h2>
            <p><strong>Categoria:</strong> ${produto.categoria}</p>
            <p>${produto.descricao}</p>
            <p class="preco">AOA ${produto.preco.toFixed(2)}</p>
            <p class="estoque" style="color: ${esgotado ? '#dc3545' : '#28a745'};">
                Estoque disponível: ${esgotado ? 'ESGOTADO' : produto.estoque + ' unidades'}
            </p> 
        `;

        const botoesContainer = document.createElement('div');
        botoesContainer.classList.add('card-botoes');

        const btnCarrinho = document.createElement('button');
        btnCarrinho.className = 'btn btn-carrinho';
        btnCarrinho.textContent = 'Adicionar ao Carrinho';
        btnCarrinho.addEventListener('click', () => adicionarAoCarrinho(produto.id));

        const btnComprar = document.createElement('button');
        btnComprar.className = 'btn btn-comprar';
        btnComprar.textContent = 'Comprar Agora';
        btnComprar.addEventListener('click', () => comprarAgora(produto.id));
        
        const btnDetalhes = document.createElement('button');
        btnDetalhes.className = 'btn-detalhes';
        btnDetalhes.textContent = 'Ver Detalhes';
        btnDetalhes.addEventListener('click', (event) => verDetalhes(event.target, produto.detalhes));

        // 🚀 MELHORIA 2: Desativação do botão se o produto estiver esgotado
        if (esgotado) {
            btnCarrinho.disabled = true;
            btnCarrinho.textContent = 'Esgotado';
            btnComprar.disabled = true;
        }

        botoesContainer.appendChild(btnCarrinho);
        botoesContainer.appendChild(btnComprar);
        
        article.appendChild(botoesContainer);
        article.appendChild(btnDetalhes);

        cardContainer.appendChild(article);
    }
}

// 4. Função para mostrar/ocultar detalhes (toggle)
function verDetalhes(botao, detalhes) {
    const card = botao.closest('.card');
    const detalhesContainer = card.querySelector('.detalhes-container');

    if (detalhesContainer) {
        detalhesContainer.remove();
        botao.textContent = 'Ver Detalhes';
    } else {
        const novoDetalhesContainer = document.createElement('div');
        novoDetalhesContainer.classList.add('detalhes-container');
        
        novoDetalhesContainer.innerHTML = `
            <h4>Detalhes do Produto:</h4>
            <ul>
                <li><strong>Fabricante:</strong> ${detalhes.fabricante || 'N/A'}</li>
                <li><strong>Data de Validade:</strong> ${detalhes.data_validade || 'N/A'}</li>
                <li><strong>Dosagem:</strong> ${detalhes.dosagem || 'N/A'}</li>
                <li><strong>Forma Farmacêutica:</strong> ${detalhes.forma_farmaceutica || 'N/A'}</li>
            </ul>
        `;
        // Insere o container de detalhes logo após o botão
        botao.insertAdjacentElement('afterend', novoDetalhesContainer);
        botao.textContent = 'Ocultar Detalhes';
    }
}

// 3. Função de Pesquisa
function filtrarProdutos() {
    const termoBusca = document.getElementById('busca-input').value.toLowerCase().trim();
    
    const produtosFiltrados = todosProdutos.filter(produto => 
        produto.nome.toLowerCase().includes(termoBusca) ||
        produto.categoria.toLowerCase().includes(termoBusca) ||
        produto.descricao.toLowerCase().includes(termoBusca)
    );

    renderizarCards(produtosFiltrados); 
}

// 5. Funções para os botões de compra e carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = todosProdutos.find(p => p.id === produtoId);
    
    // 1. Verificações iniciais (produto existe e estoque > 0)
    if (!produto || produto.estoque <= 0) {
        alert(!produto ? "Erro: Produto não encontrado." : `${produto.nome} está esgotado!`);
        return;
    }

    // 2. Tenta encontrar o item no carrinho e verifica a quantidade atual
    let itemExistente = carrinho.find(item => item.id === produtoId);
    let quantidadeAtualNoCarrinho = itemExistente ? itemExistente.quantidade : 0;
    
    // 🚀 NOVO: VERIFICAÇÃO DE ESTOQUE MÁXIMO ANTES DE ADICIONAR
    if (quantidadeAtualNoCarrinho >= produto.estoque) {
        alert(`❌ Limite de Estoque: Você já adicionou ${produto.estoque} unidades de ${produto.nome}. Não há mais estoque disponível!`);
        return; // Bloqueia a adição
    }
    // -----------------------------------------------------------

    // 3. Incrementa a quantidade (apenas se a verificação acima passou)
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ id: produtoId, quantidade: 1 });
    }

    // 4. Salva o novo estado e atualiza a contagem
    salvarCarrinho(); 
    atualizarContagemCarrinho(); 
    
    console.log(`${produto.nome} foi adicionado ao carrinho!`);
    alert(`${produto.nome} adicionado ao carrinho!`);
}

function salvarEstoque() {
    localStorage.setItem('catalogoFarmacia', JSON.stringify(todosProdutos));
    atualizarMetricsEstoque();
}

function comprarAgora(produtoId) {
    const produto = todosProdutos.find(p => p.id === produtoId);
    
    // 1. Verifica se o produto existe
    if (!produto) {
        alert("❌ Erro: Produto não encontrado.");
        return;
    }
    
    // 2. Verifica se há estoque
    if (produto.estoque <= 0) {
        alert(`❌ Operação falhou: ${produto.nome} está esgotado! Não é possível comprar.`);
        return;
    }
    
    // 3. 🚀 Ação: Desconta 1 unidade
    try {
        produto.estoque--;
    
        // 4. Alerta de Sucesso
        alert(`Compra bem-sucedida! 1 unidade de ${produto.nome} comprada. Estoque restante: ${produto.estoque}.`);
    
        // 5. Atualiza o display e salva
        renderizarCards(todosProdutos);
        salvarEstoque(); // Salva o catálogo atualizado no LocalStorage
        
    } catch (error) {
        console.error("Erro ao processar a compra imediata:", error);
        alert("❌ Operação falhou: Ocorreu um erro ao finalizar a compra.");
    }
}

// Localizada no script.js

function atualizarMetricsEstoque() {
    // 1. Conta quantos TIPOS de produtos têm estoque > 0
    // Usamos 'Number(p.estoque) > 0' para garantir que é um número
    const tiposDisponiveis = todosProdutos.filter(p => Number(p.estoque) > 0).length;
    
    // 2. Soma o TOTAL de UNIDADES (soma do estoque de todos os produtos)
    const unidadesTotais = todosProdutos.reduce((acc, produto) => {
        // CORREÇÃO: Garante que produto.estoque é um número (ou 0 se for NaN/null/undefined)
        const estoqueNumerico = Number(produto.estoque) || 0; 
        return acc + estoqueNumerico;
    }, 0); // O '0' aqui é o valor inicial do acumulador (acc)

    const tiposElement = document.getElementById('tipos-count');
    const unidadesElement = document.getElementById('unidades-count');

    if (tiposElement) {
        tiposElement.textContent = tiposDisponiveis;
    }
    if (unidadesElement) {
        unidadesElement.textContent = unidadesTotais;
    }
}

// Inicializa a aplicação carregando os dados quando a página é aberta
carregarDados();