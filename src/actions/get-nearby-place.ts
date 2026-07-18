import { geonamesApi } from "../config/api/SitesApi";
import { GeoNamePlace } from "../infrastructure/nearby.response";


export const findNearbyPlaces = async (
    latitude: number,
    longitude: number,
): Promise<GeoNamePlace[]> => {
    
    const response = await geonamesApi.get('/findNearbyPlaceNameJSON', {
        params: {
            lat: latitude,
            lng: longitude,
            maxRows: 10,
        },
    });

    return response.data.geonames || [];
};