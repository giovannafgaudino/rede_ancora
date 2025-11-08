// screens/PartSearchScreen.js (Paleta de Cores da Rede Âncora)

// ... (imports permanecem os mesmos)
import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    Alert, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator,
    Image,
    SafeAreaView
} from 'react-native';


import ResultTable from '../components/ResultTable';
import ProductCard from '../components/ProductCard'; 
import { searchPart } from '../Services/ancoraAPI'; 
import { Ionicons } from '@expo/vector-icons';
const LOGO_SOURCE = require('../assets/ancora-logo.png');


// PALETA DE CORES ATUALIZADA
const COLORS = {
    PRIMARY: '#002741',     // Azul Escuro (Solidez)
    SECONDARY: '#C41F2E',   // Vermelho Principal (Destaque/Ação)
    BACKGROUND: '#F7F8FA',  // Cinza Claro (Fundo Geral)
    HEADER_BG: '#FBF3F4',   // Branco Rosado (Fundo do Header)
    SUCCESS: '#4CAF50',     // Verde de Sucesso
};

export default function PartSearchScreen({ route, navigation }) {
    // ... (lógica de navegação e states permanecem os mesmos)
    const placa = route?.params?.placa || 'PLACA_NAO_ENVIADA';
    const veiculoData = route?.params?.veiculoData || {};
    const montadora = route?.params?.montadora || 'N/A';
    
    // ... (tratamento de erro de navegação)
    if (!route || !route.params || !route.params.placa) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.fatalErrorText}>❌ Erro de Navegação</Text>
                <Text style={styles.errorText}>Acesse pelo menu principal (busca de placa) para continuar.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const [termoBusca, setTermoBusca] = useState('AMORTECEDOR'); 
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!termoBusca) {
            return Alert.alert("Busca Inválida", "Por favor, insira o nome da peça.");
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const data = await searchPart(placa, termoBusca, montadora); 

            if (data.success) {
                setResults(data);
            } else {
                setError(data.message || 'Erro ao buscar peças.');
            }
        } catch (err) {
            setError('Erro ao processar a busca da peça. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}>

            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
              
                {/* Header fixo com logo (fundo azul escuro) */}
                <View style={styles.header}>
                  <Image source={LOGO_SOURCE} style={styles.logo} resizeMode="contain" />
                </View>



                
                {/* Cabeçalho do Veículo Selecionado */}
                <View style={styles.vehicleHeader}>
                    <Ionicons name="car-outline" size={24} color={COLORS.PRIMARY} />
                    <Text style={styles.vehicleText}>
                        <Text style={{fontWeight: 'normal'}}>Veículo Selecionado:</Text> <Text style={styles.vehicleHighlight}>{montadora} {veiculoData.Modelo}</Text> | <Text style={styles.vehicleHighlight}>{placa}</Text>
                    </Text>
                </View>

                {/* Área de Busca */}
                <View style={styles.searchBox}>
                    <Text style={styles.title}>O que você precisa?</Text>
                    <View style={styles.inputGroup}>
                        <Ionicons name="search" size={24} color={COLORS.SECONDARY} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Amortecedor, Filtro de Óleo"
                            value={termoBusca}
                            onChangeText={setTermoBusca}
                            placeholderTextColor="#999"
                        />
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.button, loading ? styles.buttonDisabled : styles.buttonPrimary]} 
                        onPress={handleSearch} 
                        disabled={loading} 
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Buscar Peça</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {error && <Text style={styles.error}>{error}</Text>}

                {/* Resultados */}
                {results && (
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultsHeader}>
                            <Ionicons name="pricetags-outline" size={20} color={COLORS.PRIMARY} /> Produtos Encontrados:
                        </Text>
                        
                        {results.produtos.length > 0 ? (
                            results.produtos.map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))
                        ) : (
                            <Text style={styles.noResults}>⚠️ Não encontramos produtos compatíveis com "{termoBusca}".</Text>
                        )}
                        
                        {/* Similares */}
                        {results.similares && results.similares.data && results.similares.data.length > 0 && (
                            <ResultTable 
                                title={results.similares.title} 
                                data={results.similares.data} 
                            />
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { 
        flex: 1,
    },
    header: {
      backgroundColor: COLORS.PRIMARY, // azul escuro no topo
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 15,
      marginBottom: 20,
    },
    logo: {
      width: '70%',
      height: 50,
    },

    contentContainer: { 
        padding: 20, 
        paddingBottom: 30,
        paddingTop: 75,
    },

    vehicleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.HEADER_BG, // Fundo do header levemente rosado
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.PRIMARY, // Borda Azul Escuro
        elevation: 2,
    },
    vehicleText: {
        marginLeft: 10,
        fontSize: 14,
        color: COLORS.PRIMARY,
        flexShrink: 1,
    },
    vehicleHighlight: {
        fontWeight: 'bold',
    },
    searchBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 15, 
        color: COLORS.PRIMARY,
        textAlign: 'center'
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: { 
        flex: 1,
        height: 50, 
        paddingHorizontal: 5,
        fontSize: 16,
    },
    button: {
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    buttonPrimary: {
        backgroundColor: COLORS.SECONDARY, // Vermelho Principal (Busca)
        shadowColor: COLORS.SECONDARY,
    },
    buttonDisabled: {
        backgroundColor: '#90a4ae',
    },
    buttonText: {
        color: '#fff', 
        fontWeight: 'bold',
        fontSize: 16,
    },
    resultsContainer: {
        marginTop: 10,
    },
    resultsHeader: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginTop: 15, 
        marginBottom: 10, 
        color: COLORS.PRIMARY 
    },
    error: { 
        color: COLORS.SECONDARY, 
        textAlign: 'center', 
        marginVertical: 10, 
        padding: 10,
        backgroundColor: COLORS.HEADER_BG,
        borderRadius: 8,
    },
    noResults: { 
        color: COLORS.SECONDARY, 
        textAlign: 'center', 
        marginVertical: 20, 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    // Estilos de erro de navegação
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: COLORS.BACKGROUND,
    },
    fatalErrorText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.SECONDARY,
        marginBottom: 10,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: COLORS.PRIMARY,
        padding: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});