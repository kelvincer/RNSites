import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, FlatList, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigator/navigator';
import { Button as B, Card, FAB, Text } from 'react-native-paper';
import AppCard from '../components/AppCard';
import { Place } from '../../domain/entities/Place';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { getPlaces, deletePlace } from '../../actions/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

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
                data={places.reverse()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => navigation.navigate('Details', { id: item.id })}>
                        <AppCard place={item} deletePlace={() => deletePlace(item.id, setPlaces)} />
                    </Pressable>
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