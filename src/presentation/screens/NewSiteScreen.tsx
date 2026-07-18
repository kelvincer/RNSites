import React, { useState } from 'react';
import { Image, PermissionsAndroid, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  Menu,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';
import { Place } from '../../domain/entities/Place';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigator/navigator';
import { savePlace } from '../../actions/storage';
import Geolocation from 'react-native-geolocation-service';

const categories = [
  'Restaurante',
  'Parque',
  'Museo',
  'Playa',
  'Hotel',
  'Otro',
];

type Props = NativeStackScreenProps<RootStackParamList, 'New'>;

export default function NewSiteScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [registerDate, setRegisterDate] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [visited, setVisited] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);

  const [image, setImage] = useState<Asset | null>(null);
  const [uri, setUri] = useState<string | null>(null);


  const onSave = async () => {
    const place: Place = {
      id: Date.now().toString(),
      name,
      description,
      category,
      registerDate,
      latitude: Number(latitude),
      longitude: Number(longitude),
      status: visited ? 'Visitado' : 'Pendiente',
      imageUri: uri,
    };

    console.log(place);

    await savePlace(place);
    navigation.goBack();
  };

  const selectImage = () => {
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

          setUri(image.uri || null);

          setImage(image);
        }
      },
    );
  };

  const getLocation = async () => {
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
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TextInput
        label="Nombre del lugar"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.multilineInput}
      />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Pressable onPress={() => setMenuVisible(true)}>
            <TextInput
              label="Categoría"
              value={category}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
              style={styles.input}
              pointerEvents="none"
            />
          </Pressable>
        }>
        {categories.map(item => (
          <Menu.Item
            key={item}
            title={item}
            onPress={() => {
              setCategory(item);
              setMenuVisible(false);
            }}
          />
        ))}
      </Menu>

      <TextInput
        label="Fecha de registro"
        value={registerDate}
        onChangeText={setRegisterDate}
        mode="outlined"
        placeholder="2026-07-17"
        style={styles.input}
      />

      <TextInput
        label="Latitud"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="decimal-pad"
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Longitud"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="decimal-pad"
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.switchContainer}>
        <Text variant="titleMedium">
          {visited ? 'Visitado' : 'Pendiente'}
        </Text>

        <Switch
          value={visited}
          onValueChange={setVisited}
        />
      </View>

      <Button mode="contained" onPress={selectImage}>
        Seleccionar imagen
      </Button>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{
            width: 250,
            height: 250,
            marginTop: 20,
            borderRadius: 10,
          }}
        />
      )}

      <Button
        mode="contained"
        onPress={onSave}
        style={styles.button}>
        Guardar
      </Button>

      <Button onPress={getLocation}>  Obtener ubicación</Button>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  switchContainer: {
    marginTop: 8,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    marginTop: 8,
  },
});