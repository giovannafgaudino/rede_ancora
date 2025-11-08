// screens/VehicleSearchScreen.js

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    Alert, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    ActivityIndicator,
    SafeAreaView 
} from 'react-native';
import VehicleDetailCard from '../components/VehicleDetailCard'; 
import { searchVehicle } from '../Services/ancoraAPI'; 
import { Ionicons } from '@expo/vector-icons'; 

const COLORS = {
    PRIMARY: '#002741',
    SECONDARY: '#C41F2E',
    BACKGROUND: '#F7F8FA',
    HEADER_BG: '#002741',
    SUCCESS: '#4CAF50',
    TEXT_LIGHT: '#607d8b',
};

const LOGO_SOURCE = require('../assets/ancora-logo.png'); 

export default function VehicleSearchScreen({ navigation }) {
    const [placa, setPlaca] = useState(''); 
    const [veiculoData, setVeiculoData] = useState(null);
    const [montadora, setMontadora] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        const cleanPlaca = placa.trim().toUpperCase();
        if (cleanPlaca.length < 7) {
            return Alert.alert("Placa Inválida", "Placa deve ter 7 caracteres.");
        }

        setLoading(true);
        setError(null);
        setVeiculoData(null);

        try {
            const data = await searchVehicle(cleanPlaca); 
            if (data.success) {
                setVeiculoData(data.veiculo);
                setMontadora(data.montadora);
            } else {
                setError(data.message || 'Veículo não encontrado. Verifique a placa.');
            }
        } catch (err) {
            setError('Falha na comunicação com o catálogo. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const navigateToPartSearch = () => {
        if (veiculoData && montadora) {
            navigation.navigate('PartSearch', {
                placa: placa.toUpperCase(),
                veiculoData: veiculoData,
                montadora: montadora,
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}>
            {/* HEADER */}
            <View style={styles.header}>
                <Image 
                    source={LOGO_SOURCE}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
                
                

                {/* 🔍 MÓDULO DE BUSCA (SEM ALTERAÇÕES) */}
                <View style={styles.searchBox}>
                    <Text style={styles.title}>Busca Rápida de Peças</Text>
                    <Text style={styles.subtitle}>Digite a placa e encontre o catálogo específico do veículo.</Text>
                    
                    <View style={styles.inputGroup}>
                        <Ionicons name="car-outline" size={24} color={COLORS.PRIMARY} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="ABC1234 ou ABC1D23"
                            value={placa}
                            onChangeText={setPlaca}
                            autoCapitalize="characters"
                            maxLength={7}
                            placeholderTextColor="#999"
                        />
                    </View>
                    {/* 🔧 AVALIAÇÕES DE MECÂNICOS */}
                
                    
                    <TouchableOpacity 
                        style={[styles.button, loading || placa.length < 7 ? styles.buttonDisabled : styles.buttonPrimary]} 
                        onPress={handleSearch} 
                        disabled={loading || placa.length < 7} 
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Buscar Veículo</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {error && <Text style={styles.error}>{error}</Text>}

                {veiculoData && (
                    <View style={styles.resultContainer}>
                        <View style={styles.statusHeader}>
                            <View style={styles.statusBadge}>
                                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                <Text style={styles.statusText}>Veículo Compatível Encontrado</Text>
                            </View>
                            <Text style={styles.vehicleTitle}>{montadora} {veiculoData.Modelo}</Text>
                            <Text style={styles.vehicleSubtitle}>Placa: {placa.toUpperCase()}</Text>
                        </View>
                        
                        <VehicleDetailCard vehicleData={{ ...veiculoData, Montadora: montadora }} />
                        
                        <TouchableOpacity
                            style={[styles.button, styles.continueButton]}
                            onPress={navigateToPartSearch}
                        >
                            <Text style={styles.buttonText}>Ver Catálogo de Peças <Ionicons name="arrow-forward-circle-outline" size={18} color="#fff" /></Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.reviewSection}>
                    <Text style={styles.reviewTitle}>
                        <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.PRIMARY} /> Avaliações de Mecânicos
                    </Text>

                    <View style={styles.reviewCard}>
                        <Text style={styles.reviewName}>Carlos Silva</Text>
                        <Text style={styles.reviewLocation}>São Paulo, SP • ⭐⭐⭐⭐⭐ • 15/05/2023</Text>
                        <Text style={styles.reviewText}>
                            Encontrei exatamente a peça que precisava para um Fiat Palio 2015. Preço justo e entrega rápida. Recomendo!
                        </Text>
                        <View style={styles.likeContainer}>
                            <Ionicons name="thumbs-up-outline" size={18} color={COLORS.PRIMARY} />
                            <Text style={styles.likeCount}>24</Text>
                        </View>
                    </View>

                    <View style={styles.reviewCard}>
                        <Text style={styles.reviewName}>Marcos Oliveira</Text>
                        <Text style={styles.reviewLocation}>Rio de Janeiro, RJ • ⭐⭐⭐⭐☆ • 03/04/2023</Text>
                        <Text style={styles.reviewText}>
                            App muito útil para nós mecânicos. Economizei tempo na busca de peças para um Honda Civic 2018.
                        </Text>
                        <View style={styles.likeContainer}>
                            <Ionicons name="thumbs-up-outline" size={18} color={COLORS.PRIMARY} />
                            <Text style={styles.likeCount}>18</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.moreReviewsButton}>
                        <Text style={styles.moreReviewsText}>Ver mais 1 avaliação</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.HEADER_BG,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 5,
    },
    logo: {
        width: '70%',
        height: 50,
    },
    scrollContainer: { flex: 1, backgroundColor: COLORS.BACKGROUND },
    contentContainer: { paddingHorizontal: 20, paddingBottom: 30, minHeight: '100%' },

    // 🔧 ESTILOS DE AVALIAÇÕES
    reviewSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
        elevation: 6,
        shadowColor: COLORS.PRIMARY,
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        marginBottom: 15,
    },
    reviewCard: {
        backgroundColor: '#F9FAFB',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    reviewName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
    },
    reviewLocation: {
        fontSize: 13,
        color: COLORS.TEXT_LIGHT,
        marginBottom: 8,
    },
    reviewText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeCount: {
        marginLeft: 5,
        color: COLORS.TEXT_LIGHT,
        fontSize: 13,
    },
    moreReviewsButton: {
        marginTop: 10,
        alignItems: 'center',
        paddingVertical: 8,
    },
    moreReviewsText: {
        color: COLORS.PRIMARY,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },

    // (restante dos estilos continua igual ao seu arquivo original)
    searchBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 20,
        elevation: 8,
        shadowColor: COLORS.PRIMARY,
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: COLORS.PRIMARY, textAlign: 'center' },
    subtitle: { fontSize: 14, marginBottom: 20, color: COLORS.TEXT_LIGHT, textAlign: 'center' },
    inputGroup: { flexDirection: 'row', alignItems: 'center', borderColor: COLORS.PRIMARY, borderWidth: 1, borderRadius: 10, marginBottom: 20, backgroundColor: '#fff', paddingHorizontal: 10 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 50, fontSize: 16, fontWeight: '600', color: '#333', textAlign: 'center' },
    button: { padding: 16, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowOpacity: 0.3, shadowRadius: 5 },
    buttonPrimary: { backgroundColor: COLORS.PRIMARY, shadowColor: COLORS.PRIMARY },
    buttonDisabled: { backgroundColor: '#90a4ae' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 5 },
    continueButton: { marginTop: 20, backgroundColor: COLORS.SECONDARY, shadowColor: COLORS.SECONDARY },
    resultContainer: { marginBottom: 30 },
    statusHeader: { padding: 15, borderRadius: 12, backgroundColor: '#fff', elevation: 3, shadowColor: COLORS.SUCCESS, shadowOpacity: 0.15, shadowRadius: 5, borderLeftWidth: 5, borderLeftColor: COLORS.SUCCESS, marginBottom: 10 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.SUCCESS, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start', marginBottom: 10 },
    statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12, marginLeft: 5 },
    vehicleTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.PRIMARY },
    vehicleSubtitle: { fontSize: 14, color: COLORS.TEXT_LIGHT, marginTop: 5 },
    error: { color: COLORS.SECONDARY, textAlign: 'center', marginVertical: 10, padding: 10, backgroundColor: COLORS.HEADER_BG, borderRadius: 8, fontWeight: '600' },
});
