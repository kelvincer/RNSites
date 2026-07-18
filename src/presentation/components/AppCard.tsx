import * as React from 'react';
import { Avatar, Button, Card, Chip, IconButton, Text } from 'react-native-paper';
import { Place } from '../../domain/entities/Place';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  place: Place;
  deletePlace: (id: string) => void;
}

const AppCard = ({ place, deletePlace }: Props) => {


  return (

    <Card
      style={styles.card}
      mode="elevated"
    >
      <View style={styles.container}>

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200' }}
          style={styles.image}
        />

        <View style={styles.content}>

          <View style={styles.header}>

            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={styles.title}
            >
              {place.name}
            </Text>

            <IconButton
              icon="delete-outline"
              size={22}
              onPress={() => deletePlace(place.id)}
            />

          </View>

          <Chip
            compact
            icon="map-marker"
            style={styles.chip}
          >
            {place.category}
          </Chip>

          <Text
            variant="bodyMedium"
            numberOfLines={2}
            style={styles.description}
          >
            {place.description}
          </Text>

          <View style={styles.coordinates}>

            <View style={styles.coordinate}>
              <IconButton
                icon="crosshairs-gps"
                size={16}
                style={styles.icon}
              />
              <Text variant="bodySmall">
                {place.latitude}
              </Text>
            </View>

            <View style={styles.coordinate}>
              <IconButton
                icon="earth"
                size={16}
                style={styles.icon}
              />
              <Text variant="bodySmall">
                {place.longitude}
              </Text>
            </View>

          </View>

          <Text variant="bodyLarge" style={{ color: place.status === 'Visitado' ? 'green' : 'blue' }}>
            {place.status}
          </Text>

        </View>

      </View>
    </Card>
  );

  /* return (
    <Card style={{ marginBottom: 10 }}>
      <Card.Content>
        <Text variant="titleMedium">{place.name}</Text>
        <Text>{place.description}</Text>
        <Text>{place.category}</Text>
        <Text>{place.status}</Text>
        <Button onPress={() => deletePlace(place.id)
        }>Eliminar</Button>
      </Card.Content>

      {place.imageUri && (
        <Card.Cover source={{ uri: place.imageUri }} />
      )}
    </Card>
  ); */
}

export default AppCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },

  container: {
    flexDirection: 'row',
  },

  image: {
    width: 110,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },

  content: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 8,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    fontWeight: 'bold',
  },

  chip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  description: {
    marginBottom: 10,
  },

  coordinates: {
    marginTop: 'auto',
  },

  coordinate: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    margin: 0,
    marginRight: 4,
  },
});