import axios from 'axios';


const GEONAMES_USERNAME = 'kelcervan';
const BASE_URL = 'https://secure.geonames.org';


/* const fetchLocation = async (latitude: string, longitude: string) => {

    try {
        // Nota: GeoNames usa HTTP por defecto en su capa gratuita. 
        // Si usas HTTPS, asegúrate de tener el plan adecuado o usar 'secure.geonames.org'
        const response = await axios.get('http://api.geonames.org/findNearbyPlaceNameJSON', {
            params: {
                lat: latitude,
                lng: longitude,
                username: GEONAMES_USERNAME,
                lang: 'es', // Para obtener los resultados en español si están disponibles
            },
        });
    };

} */


/* export const sitesApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
}) */

export const geonamesApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    username: GEONAMES_USERNAME,
  },
});