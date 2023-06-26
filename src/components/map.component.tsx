import React from 'react';
import { Map, Marker } from 'pigeon-maps';

type MapProps = {
    locations:Array<{
        latitude: number;
        longitude: number;
    }>;
};

const MapComponent: React.FC<MapProps> = ({locations}) => {
  return (
    <Map center={[locations[0].latitude,locations[0].longitude]} zoom={10} height={400}>
      {locations.map(each=><Marker anchor={[each.latitude,each.longitude]} />)}
    </Map>
  );
};

export default MapComponent;