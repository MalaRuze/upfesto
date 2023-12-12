"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

type LocationMapProps = {
  lat: number;
  lng: number;
};
const LocationMap = ({ lat, lng }: LocationMapProps) => {
  const position = { lat: lat, lng: lng };
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
      <div className="h-80 w-full ">
        <Map
          zoom={12}
          center={position}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
          disableDefaultUI
          style={{ borderRadius: "1rem" }}
        >
          <Marker position={position} />
        </Map>
      </div>
    </APIProvider>
  );
};

export default LocationMap;
