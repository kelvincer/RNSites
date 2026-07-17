import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigator/navigator';
import { Text } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsScreen({ route, navigation }: Props) {
  const { name, age } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla Details</Text>

      <Text>Nombre: {name}</Text>
      <Text>Edad: {age}</Text>

      <Button
        title="Volver"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});