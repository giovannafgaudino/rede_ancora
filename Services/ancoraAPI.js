// services/ancoraApi.js

// =================================================================
// 1. Credenciais e Configurações (Atualizadas)
// =================================================================
const CLIENT_ID = "652116e6fb024df8b54df7a63079bf25"; // Credenciais atualizadas
const CLIENT_SECRET = "db5917ec73da4773bb47273a738af5cc"; // Credenciais atualizadas

const URL_LOGIN = "https://sso-catalogo.redeancora.com.br/connect/token";
const URL_BUSCA = "https://api-stg-catalogo.redeancora.com.br/superbusca/api/integracao/catalogo/v2/produtos/query/sumario";

let ACCESS_TOKEN = null; // Armazenar o token em memória

// =================================================================
// 2. Funções de Utilidade (Token e Formatação)
// =================================================================

/**
 * Obtém o token de acesso.
 */
export async function getAccessToken() {
    if (ACCESS_TOKEN) return ACCESS_TOKEN;

    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);

    try {
        const response = await fetch(URL_LOGIN, {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data.toString(),
        });

        // Adaptação da checagem de status e erro do Python
        if (!response.ok) { 
            const errorText = await response.text();
            throw new Error(`Erro na autenticação (${response.status}): ${errorText.substring(0, 100)}...`);
        }

        const tokenData = await response.json();
        ACCESS_TOKEN = tokenData.access_token;
        if (!ACCESS_TOKEN) throw new Error("O 'access_token' não foi encontrado na resposta.");
        
        return ACCESS_TOKEN;
    } catch (error) {
        console.error("Erro ao obter token:", error);
        // Garante que a mensagem de erro seja propagada
        throw new Error(`Falha ao conectar/autenticar: ${error.message || error}`); 
    }
}

/**
 * Filtra os similares: prioriza OEM, ou retorna os 3 primeiros. (Lógica do Python adaptada)
 */
function formatSimilares(similaresList, montadoraVeiculo) {
    if (!similaresList || similaresList.length === 0) {
        return {
            title: `##### ⚠️ Sem referências Similares/Cross-References na API para este produto.`,
            data: [],
        };
    }

    const montadora = montadoraVeiculo.toUpperCase();
    let filteredSimilares = [];
    let title = "";
    
    // 1. Tenta filtrar pela Marca do Veículo (Montadora)
    const oemSimilares = similaresList.filter(sim => sim.marca?.toUpperCase() === montadora);

    if (oemSimilares.length > 0) {
        filteredSimilares = oemSimilares;
        title = `#### ✅ Produtos Similares (Cross-References) da Montadora **${montadora}**:`;
    } else {
        // 2. Fallback para os 3 primeiros
        filteredSimilares = similaresList.slice(0, 3);
        title = `#### 🤝 Produtos Similares (Top 3 Alternativas) - Montadora **${montadora}** não encontrada:`;
    }

    // 3. Formatação (Colunas do Python adaptadas para o objeto JS)
    const data = filteredSimilares.map(sim => ({
        Marca: sim.marca || 'N/A',
        "Código Referência": sim.codigoReferencia || 'N/A',
        CNA: sim.cna || 'N/A',
        "Info. Complementares": sim.informacoesComplementares || 'N/A',
    }));

    return { title, data };
}


// =================================================================
// 3. Funções de Busca Principal (searchVehicle e searchPart)
// =================================================================

/**
 * Busca os dados do veículo pela placa. (Adaptação da Etapa A do Python)
 */
export async function searchVehicle(placa) {
    const token = await getAccessToken();
    const headersBusca = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    
    const bodyBuscaVeiculo = { 
        "veiculoFiltro": { "veiculoPlaca": placa.toUpperCase() }, 
        "superbusca": "PECA", 
        "pagina": 0, "itensPorPagina": 1 
    };

    try {
        const responseVeiculo = await fetch(URL_BUSCA, {
            method: 'POST',
            headers: headersBusca,
            body: JSON.stringify(bodyBuscaVeiculo),
        });

        if (!responseVeiculo.ok) {
            throw new Error(`Erro na busca de veículo: ${responseVeiculo.status}`);
        }
        
        const dataVeiculo = await responseVeiculo.json();

        // Lógica de fallback para 'veiculo_data' adaptada do Python:
        const vehicleDataFromPageResult = dataVeiculo.pageResult?.vehicle;
        const vehicleDataFromProducts = dataVeiculo.produtos?.[0]?.aplicacoes?.[0];
        
        const vehicle = vehicleDataFromPageResult || vehicleDataFromProducts;

        if (!vehicle) {
             return { success: false, message: `Veículo com placa ${placa} não encontrado.` };
        }

        const montadoraVeiculo = vehicle.montadora || 'N/A';
        
        // Estrutura de dados do veículo (Tabela do Python adaptada para objeto JS)
        const veiculoData = {
            Montadora: montadoraVeiculo,
            Modelo: vehicle.modelo || 'N/A',
            Versão: vehicle.versao || 'N/A',
            Motor: vehicle.motor || 'N/A',
            Câmbio: vehicle.cambio || 'N/A',
            Combustível: vehicle.combustivel || 'N/A',
            "Ano/Modelo": `${vehicle.anoFabricacao || 'N/A'}/${vehicle.anoModelo || 'N/A'}`,
            Carroceria: vehicle.carroceria || 'N/A',
        };
        
        return { success: true, veiculo: veiculoData, montadora: montadoraVeiculo };

    } catch (error) {
        console.error(`Erro na busca de veículo para ${placa}:`, error);
        throw new Error(error.message || 'Erro ao buscar dados do veículo.');
    }
}

/**
 * Busca as peças usando a placa, termo e a montadora do veículo. (Adaptação da Etapa C do Python)
 */
export async function searchPart(placa, termoBusca, montadoraVeiculo) {
    const token = await getAccessToken();
    const headersBusca = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const bodyBuscaEspecifica = { 
        "veiculoFiltro": { "veiculoPlaca": placa.toUpperCase() },
        "superbusca": termoBusca, 
        "pagina": 0, "itensPorPagina": 10 
    };

    try {
        const responseEspecifica = await fetch(URL_BUSCA, {
            method: 'POST',
            headers: headersBusca,
            body: JSON.stringify(bodyBuscaEspecifica),
        });
        
        if (!responseEspecifica.ok) {
            throw new Error(`Erro na busca de peça: ${responseEspecifica.status}`);
        }
        
        const dataEspecifica = await responseEspecifica.json();
        
        // Lógica de extração de produtos do Python adaptada
        const produtos = dataEspecifica.produtos || dataEspecifica.pageResult?.data || [];
        const total = dataEspecifica.totalRegistros || dataEspecifica.pageResult?.count || 0;

        if (total === 0) {
            return { success: true, produtos: [], message: `⚠️ Nenhuma peça '${termoBusca}' compatível encontrada.` };
        }

        // Formatação da lista principal de produtos encontrados (colunas do Python adaptadas)
        const formattedProdutos = produtos.map(prod => ({
            Marca: prod.marca || 'N/A', // Era 'marca' no Python
            "Nome Produto": prod.nomeProduto || 'N/A', // Era 'nomeProduto' no Python
            "Código Ref. Principal": prod.codigoReferencia || 'N/A', // Era 'codigoReferencia' no Python
            "CNA Principal": prod.cna || 'N/A', // Era 'cna' no Python
            "Info. Detalhada": prod.informacoesComplementares || 'N/A', // Era 'informacoesComplementares' no Python
        }));

        const similares = produtos[0]?.similares || [];
        const formattedSimilares = formatSimilares(similares, montadoraVeiculo);
        
        return {
            success: true,
            produtos: formattedProdutos,
            similares: formattedSimilares,
            totalProdutos: total,
            produtoPrincipal: {
                Marca: produtos[0].marca || 'N/A',
                Codigo: produtos[0].codigoReferencia || 'N/A',
            }
        };

    } catch (error) {
        console.error("Erro na busca específica de peças:", error);
        throw new Error(error.message || 'Erro ao buscar dados da peça.');
    }
}