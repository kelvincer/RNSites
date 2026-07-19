import { Place } from "../../domain/entities/Place";

export type RootStackParamList = {
  Home: undefined;
  Details: {
    id: string;
  };
  New: {
    place: Place | undefined;
  };
};