import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, Image, FlatList, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigator/navigator';
import { ActivityIndicator, Card, Chip, Divider, List, Text } from 'react-native-paper';
import { Place } from '../../domain/entities/Place';
import { getPlace } from '../../actions/storage';
import { findNearbyPlaces } from '../../actions/get-nearby-place';
import { GeoNamePlace } from '../../infrastructure/nearby.response';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;


export default function DetailsScreen({ route, navigation }: Props) {
  const idRef = useRef(route.params.id);

  const [place, setPlace] = useState<Place | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<GeoNamePlace[] | undefined>(undefined);

  useEffect(() => {
    loadPlace();
  }, []);

  const loadPlace = async () => {
    const data = await getPlace(idRef.current);
    setPlace(data);
    const places = await findNearbyPlaces(data?.latitude || 0, data?.longitude || 0);
    setNearbyPlaces(places);
  };

  if (!nearbyPlaces) {
    return <ActivityIndicator size="large" style={styles.loader} animating={true} />
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: place?.imageUri ?? 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200' }}
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
            style={styles.chip}>
            {place?.category}
          </Chip>

          <Divider style={styles.divider} />

          <Text
            variant="titleMedium"
            style={styles.sectionTitle}>
            Descripción
          </Text>

          <Text variant="bodyLarge">
            {place?.description}
          </Text>

          <Divider style={styles.divider} />

          <List.Item
            title="Latitud"
            left={(props) => (
              <List.Icon {...props} icon="crosshairs-gps"
                style={{ margin: 0, marginLeft: 0, marginRight: 0 }} />
            )}
          />

          <List.Item
            title="Longitud"
            description={place?.longitude.toString()}
            left={(props) => (
              <List.Icon {...props} icon="earth"
                style={{ margin: 0, marginLeft: 0, marginRight: 0 }} />
            )}
          />

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Lugares cercanos:
          </Text>

          <FlatList
            data={nearbyPlaces}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.geonameId.toString()}
            renderItem={({ item }) => (
              <Text>{item.name}</Text>
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});