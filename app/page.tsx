import Link from 'next/link';
import Image from 'next/image';
import { getVehicles, type Vehicle } from '../lib/api';

export default async function Home() {
  console.log('Starte Home-Komponente...');
  const vehicles = await getVehicles();
  console.log('Fahrzeuge erhalten:', JSON.stringify(vehicles, null, 2));

  if (!vehicles || vehicles.length === 0) {
    return (
      <div>
        <h1>Fahrzeugliste</h1>
        <p>Keine Fahrzeuge gefunden oder es ist ein Fehler aufgetreten.</p>
        <p>Bitte überprüfen Sie die Konsole für weitere Informationen.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Fahrzeugliste Single Client 4</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle: Vehicle) => (
          <li key={vehicle.id} className="border rounded-lg p-4 shadow-md">
            <Link href={`/vehicle/${vehicle.id}`}>
              <Image
                src={vehicle.imageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h2 className="text-xl font-semibold">{vehicle.make} {vehicle.model}</h2>
              <p className="text-lg font-bold text-blue-600">{vehicle.price}</p>
              <p className="text-sm text-gray-600 mt-2">{vehicle.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}