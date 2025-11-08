// components/ResultTable.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultTable = ({ title, data }) => {
    // Verifica se 'data' é um array (para Similares) ou um objeto (para Veículo)
    const isArray = Array.isArray(data);
    const dataToDisplay = isArray ? data : Object.entries(data);

    if (!dataToDisplay || dataToDisplay.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            
            <View style={styles.table}>
                {/* Cabeçalho da Tabela (apenas se for array de produtos similares) */}
                {isArray && dataToDisplay.length > 0 && (
                    <View style={styles.headerRow}>
                        {Object.keys(dataToDisplay[0]).map((key, index) => (
                            <Text key={index} style={[styles.cell, styles.headerCell, { flex: index === 0 ? 0.3 : 1 }]}>{key}</Text>
                        ))}
                    </View>
                )}

                {/* Linhas de Dados */}
                {dataToDisplay.map((item, rowIndex) => {
                    // Para objeto (Veículo): item = [chave, valor]
                    // Para array (Similares): item = {obj}
                    
                    if (isArray) {
                        // Linha para Similares (Array de Objetos)
                        return (
                            <View key={rowIndex} style={styles.dataRow}>
                                {Object.values(item).map((value, colIndex) => (
                                    <Text key={colIndex} style={[styles.cell, { flex: colIndex === 0 ? 0.3 : 1 }]} numberOfLines={2}>
                                        {value}
                                    </Text>
                                ))}
                            </View>
                        );
                    } else {
                        // Linha para Veículo (Objeto)
                        return (
                            <View key={rowIndex} style={styles.dataRow}>
                                <Text style={[styles.cell, styles.labelCell]}>{item[0]}</Text>
                                <Text style={[styles.cell, styles.valueCell]}>{item[1]}</Text>
                            </View>
                        );
                    }
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
        backgroundColor: '#e0f7fa',
        color: '#006064',
    },
    table: {
        padding: 5,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#e3f2fd',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dataRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cell: {
        paddingHorizontal: 5,
        fontSize: 12,
        color: '#333',
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#1565c0',
    },
    labelCell: {
        flex: 0.4,
        fontWeight: 'bold',
    },
    valueCell: {
        flex: 0.6,
    },
});

export default ResultTable;