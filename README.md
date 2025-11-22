Farmácia-MP: Sistema de Catálogo e Gestão de Estoque

📝 Descrição Geral do Projeto

Este projeto é uma aplicação web que simula um Catálogo de Produtos Farmacêuticos com um sistema básico de Gestão de Estoque e Carrinho de Compras. Utiliza HTML, CSS e JavaScript puro,
empregando o Local Storage para persistência de dados, simulando a funcionalidade de um backend sem a necessidade de um servidor.

🎯 Análise e Utilidade no Mundo Real

A Farmácia-MP aborda desafios comuns em ambientes de e-commerce e varejo farmacêutico, oferecendo as seguintes utilidades práticas:

    Gestão de Inventário (Estoque): A funcionalidade principal é o desconto imediato do estoque após compras ou finalização do carrinho. Isso reflete a necessidade crucial de manter o 
    inventário preciso para evitar vendas de produtos esgotados (overselling).

    Controle de Compra Segura: O sistema impede que o cliente adicione ao carrinho mais unidades do que o estoque disponível, resolvendo um problema comum de usabilidade e logística.

    Persistência de Dados: O uso do Local Storage para guardar o estado do Estoque e do Carrinho simula como os dados seriam mantidos em um banco de dados real, garantindo que o estado
    da loja não se perca ao recarregar a página.
    JSON: Simula a base de dados do catálogo de produtos.

💡 Criatividade e Inovação

A criatividade do projeto reside na solução elegante de desafios complexos utilizando apenas o front-end:

    Simulação de Backend (Local Storage): A ideia de transformar o Local Storage numa "base de dados" para o Catálogo e o Carrinho permite testar e demonstrar lógicas de negócio 
    cruciais (como transações e gestão de estoque) sem dependências externas.

    Design Consistente e Acessível (Dark Mode): A escolha de um Tema Dark (--fundo-principal: #1a1a2e) não só oferece uma apresentação moderna, mas também é ergonomicamente superior 
    para longos períodos de uso, reduzindo o cansaço visual.

    Feedback Visual Padronizado: A padronização dos alertas de sucesso e falha com emojis (✅, ❌, ℹ️) é uma abordagem criativa e eficaz para fornecer feedback imediato e intuitivo ao 
    utilizador.

⚡ Eficiência e Desempenho

A eficiência do projeto é alcançada através de práticas de desenvolvimento limpas:

    HTML, CSS e JavaScript Puro: A ausência de frameworks de terceiros resulta em um carregamento rápido e um código leve e fácil de manter.

    Otimização do DOM: Funções como renderizarCards e renderizarCarrinho manipulam o DOM de forma eficiente, redesenhando apenas o necessário após interações do usuário.

    Métricas de Estoque: O cálculo em tempo real das métricas "Tipos em Catálogo" e "Unidades Totais" demonstra a capacidade do sistema de processar o inventário eficientemente.

🖥️ Apresentação e Design

O projeto foi estruturado para ser intuitivo e profissional:

    Layout Responsivo: Utilização de CSS Grid e Flexbox com Media Queries para garantir que o catálogo e o carrinho sejam perfeitamente visíveis e utilizáveis em qualquer dispositivo
    (Desktop, Tablet e Mobile).

    Rodapé Fixo (position: fixed): Garante que o branding e as informações legais (<footer>) estejam sempre visíveis na parte inferior da tela, melhorando a experiência de navegação.

    Organização do Código: Separação lógica das responsabilidades em arquivos dedicados (script.js para catálogo/geral, carrinho.js para lógica de compra) facilita a leitura e
    manutenção futura do código.

🚀 Tecnologias Utilizadas

    HTML5

    CSS3 (com Variáveis CSS e Design Responsivo)

    JavaScript (ES6+)

    Local Storage (para persistência de dados)
    Json
