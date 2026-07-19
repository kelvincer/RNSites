import AsyncStorage from '@react-native-async-storage/async-storage';
import { Place } from '../domain/entities/Place';

export const STORAGE_KEY = '@places';

export async function getPlaces(): Promise<Place[]> {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);

        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const deletePlace = async (id: string, callback: (places: Place[]) => void) => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);

        if (!json) return;

        const places: Place[] = JSON.parse(json);

        const newPlaces = places.filter(place => place.id !== id);

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(newPlaces)
        );

        //setPlaces(newPlaces); // Actualiza el estado
        callback(newPlaces); // Llama al callback para actualizar el estado en HomeScreen
    } catch (error) {
        console.log(error);
    }
};

export async function getPlace(id: string): Promise<Place | null> {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);

        if (!json) {
            return null;
        }

        const places: Place[] = JSON.parse(json);

        return places.find(p => p.id === id) ?? null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function savePlace(place: Place) {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);

        const places: Place[] = json ? JSON.parse(json) : [];

        places.push(place);

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(places),
        );
    } catch (error) {
        console.log(error);
    }
}

export const updatePlace = async (updatedPlace: Place) => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);

    if (!json) return;

    const places: Place[] = JSON.parse(json);

    const updatedPlaces = places.map(place =>
        place.id === updatedPlace.id ? updatedPlace : place
    );

    await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedPlaces)
    );
};