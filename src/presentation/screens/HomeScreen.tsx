import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigator/navigator';
import { Button as B, Card, FAB, Text } from 'react-native-paper';
import AppCard from '../components/AppCard';
import { Place } from '../../domain/entities/Place';
import { STORAGE_KEY } from './NewSiteScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export async function getPlaces(): Promise<Place[]> {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);

        return json ? JSON.parse(json).reverse() : [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

export default function HomeScreen({ navigation }: Props) {

    const [places, setPlaces] = useState<Place[]>([]);

    useEffect(() => {
        loadPlaces();
    }, []);

    const loadPlaces = async () => {
        const data = await getPlaces();
        setPlaces(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadPlaces(); // Lee los datos desde AsyncStorage
        }, [])
    );

    return (
        <View style={styles.container}>

            <FlatList
                data={places}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AppCard place={item} />
                )}
            />

            <FAB icon="plus" style={styles.fab}
                onPress={() =>
                    navigation.navigate('New')
                } />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});