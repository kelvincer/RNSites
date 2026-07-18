import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigator/navigator';
import { Card, Chip, Divider, List, Text } from 'react-native-paper';
import { Place } from '../../domain/entities/Place';
import { getPlace } from '../../actions/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;


export default function DetailsScreen({ route, navigation }: Props) {
  const idRef = useRef(route.params.id);

  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    loadPlace();
  }, []);

  const loadPlace = async () => {
    const data = await getPlace(idRef.current);
    setPlace(data);
  };

  const place2 = {
    name: 'Machu Picchu',
    description:
      'Machu Picchu es una antigua ciudad inca ubicada en los Andes peruanos.',
    category: 'Turismo',
    latitude: -13.1631,
    longitude: -72.545,
    image:
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200',
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200' }}
        style={styles.image}
        resizeMode="cover"
      />

      <Card style={styles.card}>
        <Card.Content>

          <Text variant="headlineSmall">
            {place?.name}
          </Text>

          <Chip
            icon="map-marker"
            style={styles.chip}
          >
            {place?.category}
          </Chip>

          <Divider style={styles.divider} />

          <Text
            variant="titleMedium"
            style={styles.sectionTitle}
          >
            Descripción
          </Text>

          <Text variant="bodyLarge">
            {place?.description}
          </Text>

          <Divider style={styles.divider} />

          <List.Item
            title="Latitud"
            description={place?.latitude.toString()}
            left={(props) => (
              <List.Icon {...props} icon="crosshairs-gps" />
            )}
          />

          <List.Item
            title="Longitud"
            description={place?.longitude.toString()}
            left={(props) => (
              <List.Icon {...props} icon="earth" />
            )}
          />

        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  image: {
    width: '100%',
    height: 260,
  },

  card: {
    margin: 16,
    marginTop: -25,
    borderRadius: 16,
    elevation: 4,
  },

  chip: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },

  divider: {
    marginVertical: 18,
  },

  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
});