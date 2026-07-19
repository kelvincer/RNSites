import React, { useRef, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Platform,
    PermissionsAndroid,
    Pressable,
    Image,
} from 'react-native';
import {
    Button,
    HelperText,
    IconButton,
    Menu,
    Switch,
    Text,
    TextInput,
} from 'react-native-paper';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../navigator/navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Place } from '../../domain/entities/Place';
import { launchImageLibrary } from 'react-native-image-picker';
import { savePlace, updatePlace } from '../../actions/storage';
import Geolocation from 'react-native-geolocation-service';

interface FormValues {
    id: string;
    name: string;
    description: string;
    category: string;
    date: Date;
    latitude: string;
    longitude: string;
    visited: boolean;
    imageUri: string | null;
}

const categories = [
    'Montaña',
    'Playa',
    'Ciudad',
    'Parque',
    'Restaurante',
    'Museo',
    'Otro',
];

type Props = NativeStackScreenProps<RootStackParamList, 'New'>;

export default function PlaceForm({ route, navigation }: Props) {

    const place = useRef(route.params.place).current;
    const [menuVisible, setMenuVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <Formik<FormValues>
            initialValues={{
                id: place?.id || Date.now().toString(),
                name: place?.name || '',
                description: place?.description || '',
                category: place?.category || '',
                date: place?.registerDate ? new Date(place.registerDate) : new Date(),
                latitude: place?.latitude ? place.latitude.toString() : '',
                longitude: place?.longitude ? place.longitude.toString() : '',
                visited: place?.status === 'Visitado' || false,
                imageUri: place?.imageUri || null,
            }}
            onSubmit={async (values) => {
                console.log(values);
                const newPlace: Place = {
                    id: place?.id ?? Date.now().toString(),
                    name: values.name,
                    description: values.description,
                    category: values.category,
                    registerDate: values.date.toString(),
                    latitude: Number(values.latitude),
                    longitude: Number(values.longitude),
                    status: values.visited ? 'Visitado' : 'Pendiente',
                    imageUri: values.imageUri,
                };

                if (!place) {
                    await savePlace(newPlace);
                } else {
                    await updatePlace(newPlace)
                }

                navigation.goBack();
            }}
        >
            {({
                values,
                handleChange,
                setFieldValue,
                handleSubmit,
            }) => {

                const selectImage = async () => {
                    launchImageLibrary(
                        {
                            mediaType: 'photo',
                            selectionLimit: 1, // Solo una imagen
                            quality: 1,
                        },
                        response => {
                            if (response.didCancel) {
                                console.log('Usuario canceló');
                            } else if (response.errorCode) {
                                console.log(response.errorMessage);
                            } else if (response.assets && response.assets.length > 0) {
                                const image = response.assets[0];

                                console.log(image.uri);
                                console.log(image.fileName);
                                console.log(image.type);
                                console.log(image.fileSize);

                                setFieldValue('imageUri', image.uri || null);
                            }
                        },
                    );
                }

                return (
                    <ScrollView
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps="handled">

                        <TextInput
                            mode="outlined"
                            label="Nombre del lugar"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            style={styles.input}
                        />

                        <TextInput
                            mode="outlined"
                            label="Descripción"
                            multiline
                            numberOfLines={4}
                            value={values.description}
                            onChangeText={handleChange('description')}
                            style={styles.multiline}
                        />

                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <Pressable onPress={() => setMenuVisible(true)}>
                                    <TextInput
                                        mode="outlined"
                                        label="Categoría"
                                        value={values.category}
                                        editable={false}
                                        right={
                                            <TextInput.Icon
                                                icon="menu-down"
                                                onPress={() => setMenuVisible(true)}
                                            />
                                        }
                                        onPressIn={() => setMenuVisible(true)}
                                    />
                                </Pressable>
                            }
                        >
                            {categories.map((item) => (
                                <Menu.Item
                                    key={item}
                                    title={item}
                                    onPress={() => {
                                        setFieldValue('category', item);
                                        setMenuVisible(false);
                                    }}
                                />
                            ))}
                        </Menu>

                        <View style={{ height: 16 }} />

                        <TextInput
                            mode="outlined"
                            label="Fecha"
                            value={values.date.toLocaleDateString()}
                            editable={false}
                            style={styles.input}
                            right={
                                <TextInput.Icon
                                    icon="calendar"
                                    onPress={() => setShowDatePicker(true)}
                                />
                            }
                            onPressIn={() => setShowDatePicker(true)}
                        />

                        {showDatePicker && (
                            <DateTimePicker
                                value={values.date}
                                mode="date"
                                style={styles.input}
                                display={
                                    Platform.OS === 'ios'
                                        ? 'spinner'
                                        : 'default'
                                }
                                onChange={(event, date) => {
                                    setShowDatePicker(false);

                                    if (date) {
                                        setFieldValue('date', date);
                                    }
                                }}
                            />
                        )}

                        <TextInput
                            mode="outlined"
                            label="Latitud"
                            keyboardType="decimal-pad"
                            value={values.latitude}
                            onChangeText={handleChange('latitude')}
                            style={styles.input}
                        />

                        <TextInput
                            mode="outlined"
                            label="Longitud"
                            keyboardType="decimal-pad"
                            value={values.longitude}
                            onChangeText={handleChange('longitude')}
                            style={styles.input}
                        />

                        {/* Estado */}
                        <View style={styles.switchContainer}>
                            <Text variant="bodyLarge">
                                {values.visited
                                    ? 'Visitado'
                                    : 'Pendiente'}
                            </Text>

                            <Switch
                                value={values.visited}
                                onValueChange={(value) => {
                                    setFieldValue('visited', value);
                                }}
                            />
                        </View>

                        <View style={styles.actions}>

                            <IconButton
                                icon="image"
                                mode="contained"
                                size={30}
                                onPress={() => {
                                    console.log('Seleccionar imagen');
                                    selectImage();
                                }}
                            />

                            <IconButton
                                icon="crosshairs-gps"
                                mode="contained"
                                size={30}
                                onPress={async () => {
                                    console.log('Obtener ubicación');

                                    if (Platform.OS === 'android') {
                                        const granted = await PermissionsAndroid.request(
                                            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                                        );

                                        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                                            return;
                                        }
                                    }

                                    Geolocation.getCurrentPosition(
                                        position => {
                                            console.log('Latitud:', position.coords.latitude);
                                            console.log('Longitud:', position.coords.longitude);
                                            setFieldValue('latitude', position.coords.latitude.toString());
                                            setFieldValue('longitude', position.coords.longitude.toString());
                                        },
                                        error => {
                                            console.log(error);
                                        },
                                        {
                                            enableHighAccuracy: true,
                                            timeout: 15000,
                                            maximumAge: 10000,
                                        },
                                    );
                                }}
                            />

                        </View>

                        <Pressable onPress={selectImage}>
                            <View style={styles.imageContainer}>
                                {values.imageUri ? (
                                    <Image
                                        source={{ uri: values.imageUri }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Text variant="bodyMedium">
                                            No se ha seleccionado una imagen
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>

                        <Button
                            mode="contained"
                            onPress={() => handleSubmit()}
                            style={styles.button}>
                            Guardar Información
                        </Button>

                    </ScrollView>
                )
            }}
        </Formik>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },

    title: {
        marginBottom: 20,
        alignSelf: 'center',
    },

    input: {
        marginBottom: 16,
    },

    multiline: {
        marginBottom: 16,
        minHeight: 120,
        textAlignVertical: 'top',
    },

    switchContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 24,
        marginBottom: 24,
    },

    button: {
        marginTop: 10,
        paddingVertical: 6,
    },
    imageContainer: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
    },

    image: {
        width: '100%',
        height: 220,
        borderRadius: 12,
    },

    imagePlaceholder: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
});