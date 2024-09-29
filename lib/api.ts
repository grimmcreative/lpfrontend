import axios from 'axios';
import useSWR from 'swr';
const fetcher = (url) => fetch(url).then((res) => res.json());

const API_USERNAME = process.env.MOBILE_DE_API_USERNAME;
const API_PASSWORD = process.env.MOBILE_DE_API_PASSWORD;
const API_URL = 'https://services.mobile.de/search-api/search';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  price: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
}

export function extractValue(obj: any): string {
  if (typeof obj === 'string') {
    return obj;
  }
  if (obj && typeof obj === 'object') {
    if ('@value' in obj) {
      return obj['@value'];
    }
    if ('$' in obj) {
      return obj['$'];
    }
    if ('local-description' in obj) {
      return obj['local-description']['$'];
    }
  }
  return 'Nicht verfügbar';
}

export function extractDescription(ad: any): string {
  if (ad.description && typeof ad.description === 'string') {
    return ad.description;
  }
  
  const parts = [];
  if (ad.vehicle && ad.vehicle['model-description']) {
    parts.push(extractValue(ad.vehicle['model-description']));
  }
  if (ad.vehicle && ad.vehicle.specifics) {
    const specifics = ad.vehicle.specifics;
    if (specifics.mileage) {
      parts.push(`Kilometerstand: ${extractValue(specifics.mileage)} km`);
    }
    if (specifics['first-registration']) {
      parts.push(`Erstzulassung: ${extractValue(specifics['first-registration'])}`);
    }
    if (specifics.fuel) {
      parts.push(`Kraftstoff: ${extractValue(specifics.fuel)}`);
    }
    if (specifics.power) {
      parts.push(`Leistung: ${extractValue(specifics.power)} kW`);
    }
  }
  
  return parts.length > 0 ? parts.join('. ') : 'Keine Beschreibung verfügbar';
}

export function extractPrice(priceObj: any): string {
  if (priceObj && priceObj['consumer-price-amount']) {
    const priceValue = extractValue(priceObj['consumer-price-amount']);
    if (priceValue !== 'Nicht verfügbar') {
      const formattedPrice = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(priceValue));
      return formattedPrice;
    }
  }
  return 'Auf Anfrage';
}

export function extractImageUrls(ad: any): string[] {
  if (ad.images && ad.images.image) {
    const images = Array.isArray(ad.images.image) ? ad.images.image : [ad.images.image];
    return images.flatMap((img: any) => {
      if (img.representation) {
        const representations = Array.isArray(img.representation) ? img.representation : [img.representation];
        return representations
          .filter((rep: any) => rep['@size'] === 'L' || rep['@size'] === 'XL')
          .map((rep: any) => rep['@url']);
      }
      return [];
    });
  }
  return ['/placeholder-image.jpg'];
}

export function extractImageUrl(ad: any): string {
  const urls = extractImageUrls(ad);
  return urls.length > 0 ? urls[0] : '/placeholder-image.jpg';
}

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    console.log('Starte API-Aufruf...');
    const response = await axios.get(API_URL, {
      auth: {
        username: API_USERNAME!,
        password: API_PASSWORD!,
      },
      params: {
        
      },
    });

    if (response.data && response.data['search-result'] && response.data['search-result'].ads && response.data['search-result'].ads.ad) {
      const vehicles = response.data['search-result'].ads.ad.map((ad: any) => {
        return {
          id: ad['@key'] || 'Nicht verfügbar',
          make: extractValue(ad.vehicle?.make) || 'Unbekannt',
          model: extractValue(ad.vehicle?.model) || 'Unbekannt',
          price: extractPrice(ad.price),
          description: extractDescription(ad),
          imageUrl: extractImageUrl(ad),
          imageUrls: extractImageUrls(ad),
        };
      });
      console.log(`${vehicles.length} Fahrzeuge gefunden.`);
      return vehicles;
    } else {
      console.log('Keine Ergebnisse in der API-Antwort gefunden.');
      return [];
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Fahrzeuge:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios Fehler:', error.response?.data);
    }
    return [];
  }
}

export async function getVehicleDetails(id: string): Promise<Vehicle | null> {
  try {
    console.log(`Starte API-Aufruf für Fahrzeug mit ID: ${id}`);
    const response = await axios.get(API_URL, {
      auth: {
        username: API_USERNAME!,
        password: API_PASSWORD!,
      },
      params: {
        'filter.key': id,
      },
    });

    console.log('API-Antwort erhalten:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data['search-result'] && response.data['search-result'].ads && response.data['search-result'].ads.ad) {
      const ads = response.data['search-result'].ads.ad;
      console.log(`Anzahl der gefundenen Anzeigen: ${ads.length}`);
      
      // Suche nach dem Fahrzeug mit der korrekten ID
      const matchingAd = ads.find((ad: any) => ad['@key'] === id);
      
      if (!matchingAd) {
        console.log(`Kein Fahrzeug mit der ID ${id} gefunden.`);
        return null;
      }

      console.log('Gefundene Anzeige:', JSON.stringify(matchingAd, null, 2));

      const vehicle = {
        id: matchingAd['@key'],
        make: extractValue(matchingAd.vehicle?.make) || 'Unbekannt',
        model: extractValue(matchingAd.vehicle?.model) || 'Unbekannt',
        price: extractPrice(matchingAd.price),
        description: extractDescription(matchingAd),
        imageUrl: extractImageUrl(matchingAd),
        imageUrls: extractImageUrls(matchingAd),
      };

      console.log('Verarbeitetes Fahrzeug:', JSON.stringify(vehicle, null, 2));
      return vehicle;
    } else {
      console.log('Keine Ergebnisse für das angeforderte Fahrzeug gefunden.');
      return null;
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Fahrzeugdetails:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios Fehler:', error.response?.data);
    }
    return null;
  }
}