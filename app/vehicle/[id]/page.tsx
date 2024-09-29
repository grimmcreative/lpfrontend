import { getVehicleDetails } from '../../../lib/api';

export default async function VehicleDetail({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleDetails(params.id);

  return (
    <div>
      <h1>{vehicle.make} {vehicle.model}</h1>
      <p>Preis: {vehicle.price}€</p>
      <p>Baujahr: {vehicle.year}</p>
      <p>Kilometerstand: {vehicle.mileage} km</p>
      {/* Fügen Sie hier weitere Fahrzeugdetails hinzu */}
    </div>
  );
}