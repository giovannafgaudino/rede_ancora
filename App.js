// Exemplo de App.js (ou NavigationStack.js)

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Suas Telas
import LoginScreen from './screens/LoginScreen'; // <-- NOVO
import VehicleSearchScreen from './screens/VehicleSearchScreen';
import PartSearchScreen from './screens/PartSearchScreen';

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Login" // <-- Define Login como a tela inicial
                screenOptions={{
                    headerShown: false // Geralmente escondemos o header padrão
                }}
            >
                {/* 1. Tela de Login */}
                <Stack.Screen name="Login" component={LoginScreen} /> 
                
                {/* 2. Telas Principais do App */}
                <Stack.Screen name="VehicleSearch" component={VehicleSearchScreen} />
                <Stack.Screen name="PartSearch" component={PartSearchScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;