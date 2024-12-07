import React, { useState, useEffect } from "react";
import fetchFlightsData from "../services/searchflight";
import { countryOptions } from "./countries";

type Itinerary = {
  id: string;
  price: {
    raw: number;
    formatted: string;
  };
  legs: Array<{
    id: string;
    origin: {
      id: string;
      name: string;
      displayCode: string;
      city: string;
    };
    destination: {
      id: string;
      name: string;
      displayCode: string;
      city: string;
    };
    durationInMinutes: number;
    departure: string;
    arrival: string;
    carriers: {
      marketing: Array<{
        id: number;
        logoUrl: string;
        name: string;
      }>;
    };
  }>;
};

const FlightSearchForm = () => {
  const [departureCountry, setDepartureCountry] = useState<string>("TUN");
  const [destinationCountry, setDestinationCountry] = useState<string>("CDG");
  const [flightDate, setFlightDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [flightData, setFlightData] = useState<Itinerary[]>([]);
  const [error, setError] = useState<string>("");
  const [departureAirport, setDepartureAirport] = useState<any>(null);
  const [destinationAirport, setDestinationAirport] = useState<any>(null);
  const [departureAirports, setDepartureAirports] = useState<any[]>([]);
  const [destinationAirports, setDestinationAirports] = useState<any[]>([]);
  const [loadingAirports, setLoadingAirports] = useState<boolean>(false);

  // Fetch airports for the given country
  const fetchAirports = async (
    countryCode: string,
    setAirports: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setLoadingAirports(true);
    const params = { query: countryCode, locale: "en-US" };

    try {
      const airportData = await fetchFlightsData("searchAirport", params);
      if (airportData?.data) {
        setAirports(airportData.data);
      } else {
        setAirports([]);
      }
    } catch (error) {
      console.error("Error fetching airports:", error);
      setError("Failed to fetch airports.");
    } finally {
      setLoadingAirports(false);
    }
  };

  useEffect(() => {
    if (departureCountry) {
      fetchAirports(departureCountry, setDepartureAirports);
    }
    if (destinationCountry) {
      fetchAirports(destinationCountry, setDestinationAirports);
    }
  }, [departureCountry, destinationCountry]);

  // Handle search for flights by country and date
  const handleSearchFlights = async () => {
    setError("");

    // Check if both departure and destination airports are selected
    if (!departureAirport || !destinationAirport) {
      console.error(
        "Error: Please select both departure and destination airports."
      );
      setError("Please select both departure and destination airports.");
      return;
    }

    try {
      const formattedDate = flightDate;
      console.log("Selected Flight Date:", formattedDate);

      const params = {
        originSkyId: departureAirport.skyId,
        originEntityId: departureAirport.entityId,
        destinationSkyId: destinationAirport.skyId,
        destinationEntityId: destinationAirport.entityId,
        date: formattedDate,
      };

      console.log("Search Flights Parameters:", params);

      const data = await fetchFlightsData("searchFlights", params);
      console.log("Search Flights Response:", data);

      if (data.status === false) {
        const errorMessages = data.message
          .map((msg: Record<string, any>) => Object.values(msg).join(", "))
          .join(" | ");
        console.error("API Error Messages:", errorMessages);
        setError(`Error: ${errorMessages}`);
      } else if (
        data?.context?.status === "failure" &&
        data.context.totalResults === 0
      ) {
        const noFlightsMessage =
          "No flights found for the selected route and date.";
        console.warn(noFlightsMessage);
        setError(noFlightsMessage);
      } else {
        const flightData = data?.data || [];
        console.log("Flight Data:", flightData.itineraries);
        setFlightData(flightData.itineraries);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      setError("Failed to fetch flights.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold text-center mb-4">Flight Search</h1>

      {/* Departure Country Picker */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Departure Country
        </label>
        <select
          className="p-2 w-full border rounded"
          value={departureCountry}
          onChange={(e) => setDepartureCountry(e.target.value)}
        >
          {countryOptions.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      {/* Departure Airport Picker */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Departure Airport
        </label>
        {loadingAirports ? (
          <p>Loading airports...</p>
        ) : (
          <select
            className="p-2 w-full border rounded"
            value={departureAirport?.skyId || ""}
            onChange={(e) => {
              const selectedAirport = departureAirports.find(
                (airport) => airport.skyId === e.target.value
              );
              console.log("depart", selectedAirport);
              setDepartureAirport(selectedAirport || null);
            }}
          >
            {departureAirports.length === 0 ? (
              <option>No airports available</option>
            ) : (
              departureAirports.map((airport) => (
                <option key={airport.skyId} value={airport.skyId}>
                  {airport.presentation.title} - {airport.presentation.subtitle}
                </option>
              ))
            )}
          </select>
        )}
      </div>

      {/* Destination Country Picker */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Destination Country
        </label>
        <select
          className="p-2 w-full border rounded"
          value={destinationCountry}
          onChange={(e) => setDestinationCountry(e.target.value)}
        >
          {countryOptions.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      {/* Destination Airport Picker */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Destination Airport
        </label>
        {loadingAirports ? (
          <p>Loading airports...</p>
        ) : (
          <select
            className="p-2 w-full border rounded"
            value={destinationAirport?.skyId || ""}
            onChange={(e) => {
              console.log("Selected Value:", e.target.value);
              const selectedAirport = destinationAirports.find((airport) => {
                console.log("Airport Object:", airport);
                return airport.skyId === e.target.value;
              });

              setDestinationAirport(selectedAirport || null);
            }}
          >
            {destinationAirports.map((airport) => (
              <option key={airport.skyId} value={airport.skyId}>
                {airport.presentation.title} - {airport.presentation.subtitle}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Flight Date Picker */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Flight Date</label>
        <input
          type="date"
          className="p-2 w-full border rounded"
          value={flightDate}
          onChange={(e) => setFlightDate(e.target.value)}
        />
      </div>

      {/* Search Button */}
      <div className="mb-4">
        <button
          className="p-2 w-full bg-blue-500 text-white rounded"
          onClick={handleSearchFlights}
        >
          Search Flights
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}
      {flightData.map((itinerary) => (
        <div key={itinerary.id} className="itinerary-card">
          <h2>Itinerary: {itinerary.id}</h2>
          <p>Price: {itinerary.price.formatted}</p>
          {itinerary.legs.map((leg, index) => (
            <div key={leg.id} className="leg">
              <div className="leg-info">
                <p>
                  <strong>Flight {index + 1}:</strong> {leg.origin.name} (
                  {leg.origin.city}) to {leg.destination.name} (
                  {leg.destination.city})
                </p>
                <p>
                  <strong>Departure:</strong>{" "}
                  {new Date(leg.departure).toLocaleString()}
                </p>
                <p>
                  <strong>Arrival:</strong>{" "}
                  {new Date(leg.arrival).toLocaleString()}
                </p>
                <p>
                  <strong>Duration:</strong> {leg.durationInMinutes} minutes
                </p>
                <p>
                  <strong>Carriers:</strong>{" "}
                  {leg.carriers.marketing
                    .map((carrier) => carrier.name)
                    .join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FlightSearchForm;
