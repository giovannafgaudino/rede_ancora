// components/VehicleDetailCard.js (Paleta de Cores da Rede Âncora)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// PALETA DE CORES ATUALIZADA
const COLORS = {
    PRIMARY: '#002741',     // Azul Escuro (Solidez)
    SECONDARY: '#C41F2E',   // Vermelho Principal (Destaque/Ação)
};

const DetailItem = ({ icon, label, value }) => (
    <View style={detailStyles.item}>
        <Ionicons name={icon} size={20} color={COLORS.SECONDARY} style={detailStyles.icon} />
        <View style={detailStyles.textContainer}>
            <Text style={detailStyles.label}>{label}</Text>
            <Text style={detailStyles.value}>{value}</Text>
        </View>
    </View>
);

const VehicleDetailCard = ({ vehicleData }) => {
    // ... (mapeamento de dados permanece o mesmo)
    const dataPairs = [
        { icon: 'business-outline', label: 'Montadora', value: vehicleData.Montadora },
        { icon: 'car-sport-outline', label: 'Modelo', value: vehicleData.Modelo },
        { icon: 'pricetag-outline', label: 'Versão', value: vehicleData.Versão },
        { icon: 'construct-outline', label: 'Motor', value: vehicleData.Motor },
        { icon: 'speedometer-outline', label: 'Câmbio', value: vehicleData.Câmbio },
        { icon: 'color-filter-outline', label: 'Combustível', value: vehicleData.Combustível },
        { icon: 'calendar-outline', label: 'Ano/Modelo', value: vehicleData['Ano/Modelo'] },
        { icon: 'cube-outline', label: 'Carroceria', value: vehicleData.Carroceria },
    ].filter(item => item.value !== 'N/A' && item.value !== ' / N/A');


    return (
        <View style={detailStyles.container}>
            <Text style={detailStyles.cardTitle}>Ficha Técnica</Text>
            <View style={detailStyles.detailsGrid}>
                {dataPairs.map((item, index) => (
                    <DetailItem key={index} {...item} />
                ))}
            </View>
        </View>
    );
};

const detailStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginTop: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 5,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.PRIMARY, // Azul Escuro
        marginBottom: 10,
        paddingBottom: 5,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%', 
        marginBottom: 10,
        paddingRight: 10,
    },
    icon: {
        marginRight: 8,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 10,
        color: '#777',
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
});

export default VehicleDetailCard;