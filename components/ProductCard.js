// components/ProductCard.js (Paleta de Cores da Rede Âncora)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// PALETA DE CORES ATUALIZADA
const COLORS = {
    PRIMARY: '#002741',     // Azul Escuro (Solidez)
    SECONDARY: '#C41F2E',   // Vermelho Principal (Destaque/Ação)
    SUCCESS: '#4CAF50',     // Verde de Sucesso
};

const ProductCard = ({ product }) => {
    // ... (dados simulados permanecem os mesmos)
    const originalPrice = 120.00; 
    const promoPrice = 99.90;
    const hasPromo = true;

    const handleAction = () => {
        Alert.alert(
            "Adicionar ao Orçamento", 
            `Produto: ${product['Nome Produto']} (${product.Marca}) adicionado!`
        );
    };

    const DetailBlock = ({ label, value }) => (
        <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>{label}:</Text>
            <Text style={styles.detailValue}>{value || 'N/A'}</Text>
        </View>
    );

    return (
        <View style={styles.card}>
            <View style={styles.contentWrapper}>
                
                {/* 1. Imagem Placeholder */}
                <View style={styles.imagePlaceholder}>
                    <Ionicons name="hardware-chip-outline" size={30} color={COLORS.PRIMARY} />
                </View>

                {/* 2. Informações Principais */}
                <View style={styles.infoContainer}>
                    <View style={styles.header}>
                        <Text style={styles.brand}>{product.Marca || 'MARCA N/A'}</Text>
                        {hasPromo && (
                            <View style={styles.promoTag}>
                                <Text style={styles.promoText}>PROMO</Text>
                            </View>
                        )}
                    </View>
                    
                    <Text style={styles.name} numberOfLines={2}>
                        {product['Nome Produto'] || 'Produto sem nome'}
                    </Text>

                    {/* Bloco de Detalhes (Vertical e Limpo) */}
                    <View style={styles.detailsGroup}>
                        <DetailBlock 
                            label="Cód. Ref." 
                            value={product['Código Ref. Principal']} 
                        />
                        <DetailBlock 
                            label="CNA" 
                            value={product['CNA Principal']} 
                        />
                    </View>
                </View>
            </View>

            {/* 3. Preço e Ação (Rodapé) */}
            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    {hasPromo && (
                        <Text style={styles.originalPrice}>
                            R$ {originalPrice.toFixed(2).replace('.', ',')}
                        </Text>
                    )}
                    <Text style={styles.currentPrice}>
                        R$ {promoPrice.toFixed(2).replace('.', ',')}
                    </Text>
                </View>
                
                <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
                    <Text style={styles.actionButtonText}>
                        <Ionicons name="chatbox-outline" size={16} color="#fff" /> Orçar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 8,
        padding: 15,
        elevation: 5, 
        shadowColor: '#000', 
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    contentWrapper: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    imagePlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#e3f2fd', 
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    brand: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.PRIMARY, // Azul Escuro
    },
    promoTag: {
        backgroundColor: COLORS.SECONDARY, // Vermelho de destaque
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    promoText: {
        color: '#fff', 
        fontSize: 10,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    detailsGroup: {
        marginTop: 5,
    },
    detailBlock: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    detailLabel: {
        fontSize: 12,
        color: '#777',
        fontWeight: '400',
        marginRight: 5,
    },
    detailValue: {
        fontSize: 12,
        color: '#333',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 5,
    },
    priceContainer: {
        alignItems: 'flex-start',
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    currentPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.PRIMARY, // Azul Escuro para o preço
        marginTop: 2,
    },
    actionButton: {
        backgroundColor: COLORS.SECONDARY, // Vermelho para o botão de Orçamento
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 5,
    },
});

export default ProductCard;