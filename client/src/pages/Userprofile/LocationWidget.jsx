import React, { useState } from "react";
import { updateLocation } from "../../api"; // Use your API instance for JWT support

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const LocationWidget = ({ userId, location }) => {
  const [loc, setLoc] = useState(location || null);
  const [loading, setLoading] = useState(false);

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      // Reverse geocode
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const geoData = await geoRes.json();
      const address = geoData.results[0]?.address_components || [];
      const city = address.find((a) => a.types.includes("locality"))?.long_name || "";
      const state = address.find((a) => a.types.includes("administrative_area_level_1"))?.long_name || "";
      const country = address.find((a) => a.types.includes("country"))?.long_name || "";

      // Weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();
      const weather = weatherData.weather?.[0]?.description || "";

      const newLoc = { city, state, country, lat: latitude, lng: longitude, weather };
      setLoc(newLoc);

      // Save to backend using your API instance
      await updateLocation({
        userId,
        city,
        state,
        country,
        lat: latitude,
        lng: longitude,
        weather,
      });
      setLoading(false);
    });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Location & Weather</h3>
      <button onClick={handleGetLocation} disabled={loading}>
        {loading ? "Obtaining..." : "Obtain Location"}
      </button>
      {loc && (
        <div style={{ marginTop: "10px" }}>
          <p>
            <strong>
              {loc.city}, {loc.state}, {loc.country}
            </strong>
          </p>
          <p>Weather: {loc.weather}</p>
          <iframe
            width="300"
            height="200"
            style={{ border: 0, marginTop: "10px" }}
            src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${loc.lat},${loc.lng}&zoom=12`}
            allowFullScreen
            title="map"
          />
        </div>
      )}
    </div>
  );
};

export default LocationWidget;