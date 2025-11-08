import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants'; // Importação da paleta de cores centralizada

// Dados de mock para simular a resposta da API (será removido ao integrar com ancoraAPI.js)
const DUMMY_REVIEWS = [
    {
        id: 1,
        name: "José A.",
        garage: "Auto Center Prime",
        rating: 5,
        review: "O catálogo por placa é um diferencial! Economiza muito tempo na identificação das peças. Ferramenta indispensável.",
        date: "2 dias atrás"
    },
    {
        id: 2,
        name: "Carla R.",
        garage: "Mecânica Rápida",
        rating: 4.5,
        review: "A busca de similares me ajudou a fechar um serviço complexo. Precisa de mais peças para veículos mais antigos, mas excelente!",
        date: "1 semana atrás"
    },
    {
        id: 3,
        name: "Pedro S.",
        garage: "Oficina do Seu Pedro",
        rating: 5,
        review: "Simples, rápido e direto ao ponto. A navegação é intuitiva. Nota 10!",
        date: "3 semanas atrás"
    },
];

/**
 * Componente funcional para renderizar o rating em estrelas.
 */
const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    const stars = [];
    const STAR_COLOR = COLORS.ACCENT; // Usando a cor ACCENT definida em constants.js

    // Estrelas cheias
    for (let i = 0; i < fullStars; i++) {
        stars.push(<Ionicons key={`full-${i}`} name="star" size={16} color={STAR_COLOR} />);
    }

    // Meia estrela
    if (hasHalfStar) {
        stars.push(<Ionicons key="half" name="star-half" size={16} color={STAR_COLOR} />);
    }

    // Estrelas vazias
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color={STAR_COLOR} />);
    }

    return <View style={styles.starContainer}>{stars}</View>;
};

/**
 * Componente individual do card de avaliação.
 */
const ReviewCard = ({ review }) => (
    <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.name}>{review.name} - {review.garage}</Text>
        </View>
        <StarRating rating={review.rating} />
        <Text style={styles.reviewText}>{review.review}</Text>
        <Text style={styles.reviewDate}>{review.date}</Text>
    </View>
);

/**
 * Componente principal que carrega e exibe as avaliações.
 * **Refatoração:** Implementa lógica de fetching simulada e tratamento de estado.
 */
export default function MechanicReviews() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            setError(null);
            
            // Simula uma chamada à API (futuramente ancoraAPI.fetchMechanicReviews())
            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay da rede
                
                // Simula erro ocasional para testar o UI de erro
                // if (Math.random() < 0.1) throw new Error("Erro de conexão");

                // Carrega os dados simulados
                setReviews(DUMMY_REVIEWS); 
            } catch (err) {
                console.error("Erro ao carregar avaliações:", err);
                setError("Não foi possível carregar as avaliações. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // --- Renderização Condicional ---

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text style={styles.loadingText}>Carregando avaliações...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>
                    <Ionicons name="warning-outline" size={16} color={COLORS.SECONDARY} /> {error}
                </Text>
            </View>
        );
    }
    
    if (reviews.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noReviewsText}>Nenhuma avaliação encontrada.</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <Text style={styles.mainTitle}>
                    <Ionicons name="chatbubbles-outline" size={24} color={COLORS.SECONDARY} /> 
                     O que dizem sobre o Catálogo?
                </Text>
                <Text style={styles.subtitle}>Avaliações dos membros da Rede</Text>
            </View>

            {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
            ))}
            
            <Text style={styles.footerText}>
                Junte-se a milhares de mecânicos que usam o Catálogo ANCORA diariamente.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.PRIMARY,
        fontSize: 14,
    },
    errorText: {
        color: COLORS.SECONDARY,
        textAlign: 'center',
        padding: 20,
    },
    noReviewsText: {
        textAlign: 'center',
        color: COLORS.GRAY_MEDIUM,
        fontStyle: 'italic',
        padding: 20,
    },
    titleBox: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.SECONDARY + '40', // Vermelho com 25% de opacidade
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.GRAY_MEDIUM,
        marginTop: 5,
    },
    reviewCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.PRIMARY,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        marginLeft: 8,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    reviewText: {
        fontSize: 14,
        color: COLORS.GRAY_DARK,
        lineHeight: 20,
        marginTop: 5,
    },
    reviewDate: {
        fontSize: 10,
        color: COLORS.GRAY_MEDIUM,
        marginTop: 10,
        textAlign: 'right',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: COLORS.PRIMARY,
        marginTop: 10,
        fontWeight: '500',
    }
});