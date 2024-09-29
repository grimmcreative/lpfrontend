import axios from 'axios';

const API_USERNAME = process.env.MOBILE_DE_API_USERNAME;
const API_PASSWORD = process.env.MOBILE_DE_API_PASSWORD;
const API_URL = 'https://services.mobile.de/search-api/v1/search';

export async function getVehicles() {
  try {
    const response = await axios.get(API_URL, {
      auth: {
        username: API_USERNAME!,
        password: API_PASSWORD!,
      },
      params: {
        // Fügen Sie hier die gewünschten Suchparameter hinzu
      },
    });

    return response.data.results;
  } catch (error) {
    console.error('Fehler beim Abrufen der Fahrzeuge:', error);
    return [];
  }
}

export async function getVehicleDetails(id: string) {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      auth: {
        username: API_USERNAME!,
        password: API_PASSWORD!,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Fahrzeugdetails:', error);
    return null;
  }
}