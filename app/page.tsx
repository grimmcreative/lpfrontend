import Link from 'next/link';
import { getVehicles } from '../lib/api';

export default async function Home() {
  const vehicles = await getVehicles();

  return (
    <div>
      <h1>Fahrzeugliste</h1>
      <ul>
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            <Link href={`/vehicle/${vehicle.id}`}>
              {vehicle.make} {vehicle.model} - {vehicle.price}€
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}