// Adiciona um "ouvinte" que espera todo o conteúdo HTML da página ser carregado antes de executar o script.
// Isso previne erros de tentar manipular elementos que ainda não existem na página.
document.addEventListener('DOMContentLoaded', () => {
    // Pega as referências dos elementos HTML e guarda em variáveis para uso fácil e rápido no script.
    const container = document.querySelector('.card-container');
    const campoBusca = document.querySelector('#campo-busca');
    const botaoBusca = document.querySelector('#botao-busca');
    
    // Cria um array vazio que irá armazenar todos os dados dos carros depois de carregados do arquivo JSON.
    let todosOsCarros = [];

    // 1. CARREGAMENTO DOS DADOS: Busca o arquivo 'data.json' no servidor.
    fetch('data.json')
        // Quando a resposta do servidor chegar, converte os dados do formato JSON para um objeto JavaScript.
        .then(response => response.json())
        // Depois de converter, executa este bloco de código com os dados prontos.
        .then(data => {
            // Armazena os dados dos carros na variável 'todosOsCarros' para uso posterior (na busca, por exemplo).
            todosOsCarros = data;
            // Chama a função para exibir todos os carros na tela pela primeira vez, assim que a página carrega.
            renderizarCards(todosOsCarros);
        })
        // Se ocorrer qualquer erro durante o carregamento (ex: arquivo não encontrado), exibe uma mensagem no console e na página.
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
            container.innerHTML = '<p>Não foi possível carregar os carros clássicos.</p>';
        });

    // 2. FUNÇÃO DE RENDERIZAÇÃO: Responsável por criar e exibir os cards na tela.
    // Ela recebe uma lista de carros como argumento.
    function renderizarCards(carros) {
        // Limpa o conteúdo atual do contêiner. Isso é crucial para não duplicar os cards a cada nova busca.
        container.innerHTML = '';

        // Se a lista de carros estiver vazia (ex: busca sem resultados), exibe uma mensagem amigável.
        if (carros.length === 0) {
            container.innerHTML = '<p>🔍 Nenhum carro encontrado para o termo pesquisado.</p>';
            return; // Encerra a função aqui, pois não há mais nada a fazer.
        }

        // Para cada carro na lista recebida, executa o código abaixo.
        carros.forEach(carro => {
            // Cria um novo elemento HTML <article> na memória.
            const artigo = document.createElement('article');
            // Adiciona a classe 'card' ao elemento, para que ele receba os estilos do CSS.
            artigo.className = 'card';
            // Preenche o conteúdo do card com HTML, usando os dados específicos de cada carro (imagem, nome, história, etc.).
            artigo.innerHTML = ` 
                <img src="${carro.imagem}" alt="${carro.nome}">
                <div class="card-content">
                    <h2>${carro.nome}</h2>
                    <div class="especificacoes">${carro.especificacoes}</div>
                    <p>${carro.historia}</p>
                    <a href="${carro.link}" target="_blank">Saiba Mais →</a>
                </div>
            `;
            // Adiciona o card recém-criado como um "filho" do contêiner na página, tornando-o visível.
            container.appendChild(artigo);
        });
    }

    // 3. FUNÇÃO DE BUSCA: Filtra os carros com base no termo digitado pelo usuário.
    function buscar() {
        // Pega o valor atual do campo de busca e converte para letras minúsculas para uma busca não sensível a maiúsculas/minúsculas.
        const termo = campoBusca.value.toLowerCase();
        // Usa o método 'filter' para criar um novo array ('carrosFiltrados') contendo apenas os carros que correspondem ao termo de busca.
        // A busca verifica se o termo está incluído no nome, na história ou nas especificações do carro.
        const carrosFiltrados = todosOsCarros.filter(carro => 
            carro.nome.toLowerCase().includes(termo) || 
            carro.historia.toLowerCase().includes(termo) ||
            carro.especificacoes.toLowerCase().includes(termo)
        );
        // Chama a função de renderização para exibir na tela apenas os carros que foram filtrados.
        renderizarCards(carrosFiltrados);
    }

    // 4. EVENTOS DE BUSCA: Define quando a função 'buscar' deve ser chamada.
    // Adiciona um "ouvinte" para o evento de clique no botão de busca. Quando clicado, chama a função 'buscar'.
    botaoBusca.addEventListener('click', buscar);
    // Adiciona um "ouvinte" para o evento de pressionar uma tecla dentro do campo de busca.
    campoBusca.addEventListener('keyup', (event) => {
        // Verifica se a tecla pressionada foi a tecla "Enter".
        if (event.key === 'Enter') {
            // Se foi "Enter", chama a função de busca.
            buscar();
        }
    });
});