import { Place } from "../../domain/entities/Place";

export type RootStackParamList = {
  Home: undefined;
  Details: {
    id: string;
  };
  Site: {
    place: Place | undefined;
  };
  Map: {
    latitude: number;
    longitude: number;
    title?: string;
  };
};