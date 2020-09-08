// React
import React, {useEffect, useState} from "react";

// Component
import LogEntryForm from './LogEntryForm';
import Chat from './Chat';

// API
import {listLogEntries} from './API';

// Username 
import UsernameGenerator from 'username-generator';

// Style
import './index.css';
import mapStyles from "./mapStyles";

// Map
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 45.501690,
  lng: -73.567253,
};

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [logEntries, setLogEntries] = useState([]);
  const [addLocation, setAddLocation] = useState(null);
  const [selected, setSelected] = useState(null);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const longitude = event.latLng.lng();
    const latitude = event.latLng.lat();
    setAddLocation({
      latitude,
      longitude
    });
  };

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <h1 className="title">
        MapChat
      </h1>

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        options={options}
        onLoad={onMapLoad}
        onClick={showAddMarkerPopup}
      >
        {
          logEntries.map((marker) => (
            <Marker
              key={marker._id}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              onClick={() => {
                setSelected(marker);
              }}
            />
          ))
        }
        {selected ? (
          <InfoWindow
          position={{ lat: selected.latitude + 0.03 , lng: selected.longitude}}
          onCloseClick={() => {
            setSelected(null);
          }}
        >
          <div className="chat">
          <Chat room={selected._id} name={UsernameGenerator.generateUsername()}/>
          </div>
        </InfoWindow>
        ) : null}
        {
          addLocation ? (
            <>
              <Marker
                position={{ lat: addLocation.latitude, lng: addLocation.longitude }}
              />
              <InfoWindow
                position={{ lat: addLocation.latitude + 0.03 , lng: addLocation.longitude}}
                onCloseClick={() => {
                  setAddLocation(null);
                }}
              >
                <div className="popup">
                  <LogEntryForm onClose={() => {
                    setAddLocation(null);
                    getEntries();
                  }} location={addLocation}/>
                </div>
              </InfoWindow>
            </>
          ) : null
        }
      </GoogleMap>
    </div>
  );
}

