import Image from 'next/image';
import { getVehicleDetails } from '../../../lib/api';

export default async function VehicleDetail({ params }: { params: { id: string } }) {
  console.log('Requested vehicle ID:', params.id);
  const vehicle = await getVehicleDetails(params.id);

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Fahrzeug nicht gefunden</h1>
        <p>Das angeforderte Fahrzeug mit der ID {params.id} konnte nicht gefunden werden.</p>
        <p>Bitte überprüfen Sie die ID und versuchen Sie es erneut.</p>
      </div>
    );
  }

  if (vehicle.id !== params.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Fehler bei der Fahrzeugabfrage</h1>
        <p>Es wurde ein Fahrzeug gefunden, aber die ID stimmt nicht überein.</p>
        <p>Angeforderte ID: {params.id}</p>
        <p>Gefundene ID: {vehicle.id}</p>
        <p>Bitte kontaktieren Sie den Support.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{vehicle.make} {vehicle.model}</h1>
      <p className="text-xl font-semibold text-blue-600 mb-4">{vehicle.price}</p>
      <p className="text-sm text-gray-500 mb-4">Fahrzeug-ID: {vehicle.id}</p>
      <h2>hier sollte was stehen</h2>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {vehicle.imageUrls.length > 0 ? (
          vehicle.imageUrls.map((url, index) => (
            <div key={index} className="relative h-64">
              <Image
                src={url}
                alt={`${vehicle.make} ${vehicle.model} - Bild ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">
            <p>Keine Bilder verfügbar</p>
          </div>
        )}
      </div>
      
      <h2 className="text-2xl font-semibold mb-2">Beschreibung</h2>
      <p className="mb-8">{vehicle.description}</p>
    </div>
  );
}