import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { Place } from '../../domain/entities/Place';

interface Props {
  place: Place;
}

const AppCard = ({ place }: Props) => (
  <Card style={{ marginBottom: 10 }}>
    <Card.Content>
      <Text variant="titleMedium">{place.name}</Text>
      <Text>{place.description}</Text>
      <Text>{place.category}</Text>
      <Text>{place.status}</Text>
    </Card.Content>

    {place.imageUri && (
      <Card.Cover source={{ uri: place.imageUri }} />
    )}
  </Card>
);

export default AppCard;