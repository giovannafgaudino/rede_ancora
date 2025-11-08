// screens/LoginScreen.js
import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Alert, 
    SafeAreaView,
    Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// PALETA DE CORES
const COLORS = {
    PRIMARY: '#002741',     // Azul Escuro (Fundo do Header e Títulos)
    SECONDARY: '#C41F2E',   // Vermelho Principal (Fundo do Card de Login e Botão)
    HEADER_BG: '#002741',   // Azul Escuro
    WHITE_ROSADO: '#FBF3F4', // Branco Rosado (Fundo da Tela)
    INPUT_BORDER: '#DEB0B5', // Rosa claro para borda
    SUCCESS: '#4CAF50',
};

// URL ou caminho para a logo (use a mesma que foi usada no VehicleSearchScreen)
const LOGO_SOURCE = require('../assets/ancora-logo.png'); 

export default function LoginScreen({ navigation }) {
    // Credenciais de demonstração preenchidas por padrão
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState(null);

    const handleLogin = () => {
        setError(null);
        
        // Lógica de Autenticação (simplesmente verifica se é 'admin/admin')
        if (username === 'admin' && password === 'admin') {
            // Sucesso: Navega para a tela de busca de veículos
            navigation.replace('VehicleSearch'); 
        } else {
            setError("Usuário ou senha inválidos. Use as credenciais de demonstração.");
            Alert.alert("Erro de Login", "Usuário ou senha inválidos.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                {/* Header Superior (AZUL ESCURO) */}
                <View style={styles.header}>
                    <View style={styles.logoWrapper}>
                         <Image 
                            source={LOGO_SOURCE} 
                            style={styles.logo} 
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.mainTitle}>Catálogo Rede ANCORA</Text>
                    <Text style={styles.subTitle}>Sua ferramenta de trabalho</Text>
                </View>

                {/* Card de Login (VERMELHO) */}
                <View style={styles.loginCard}>
                    <Text style={styles.cardTitle}>Acesso ao Sistema</Text>
                    
                    {/* Input Usuário */}
                    <View style={styles.inputGroup}>
                        <Ionicons name="person-outline" size={20} color={COLORS.SECONDARY} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu usuário"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                        />
                    </View>
                    
                    {/* Input Senha */}
                    <View style={styles.inputGroup}>
                        <Ionicons name="lock-closed-outline" size={20} color={COLORS.SECONDARY} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite sua senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#999"
                        />
                    </View>
                    
                    {/* Botão de Entrar */}
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>
                            <Ionicons name="arrow-forward-outline" size={18} color="#fff" /> Entrar
                        </Text>
                    </TouchableOpacity>

                    {/* Instrução de Demonstração */}
                    <Text style={styles.demoText}>
                        Para demonstração, use:
                        <Text style={{fontWeight: 'bold'}}> Usuário: admin | Senha: admin</Text>
                    </Text>
                    
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.WHITE_ROSADO, // Fundo geral Branco Rosado
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    // Estilos do Header (AZUL ESCURO)
    header: {
        width: '100%',
        height: 200, // Altura para o topo
        backgroundColor: COLORS.HEADER_BG, // Azul Escuro
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    logoWrapper: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        marginBottom: 10,
    },
    logo: {
        width: 60,
        height: 40,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    subTitle: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.8,
        marginTop: 4,
    },
    // Estilos do Card de Login (VERMELHO)
    loginCard: {
        width: '90%',
        backgroundColor: COLORS.SECONDARY, // Vermelho Principal
        borderRadius: 15,
        padding: 25,
        marginTop: 15, // Puxa o card para cima do header
        shadowColor: COLORS.SECONDARY,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 30,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 2,
        borderColor: COLORS.INPUT_BORDER, // Rosa Claro
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    button: {
        width: '100%',
        backgroundColor: COLORS.PRIMARY, // Azul Escuro (Contraste)
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5,
    },
    demoText: {
        fontSize: 12,
        color: '#fff',
        marginTop: 20,
        textAlign: 'center',
        opacity: 0.9,
    },
    errorText: {
        color: COLORS.PRIMARY,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 5,
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 12,
    }
});