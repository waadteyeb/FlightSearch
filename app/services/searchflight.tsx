import axios from "axios";

const API_URL = "https://sky-scrapper.p.rapidapi.com/api/v1/flights/";

const API_KEY = "eb48ba146emsh3d7f4c6fb5aa0cdp13092djsn7d47b36db399";


type Params = {
  [key: string]: string | number | undefined;
};

type Endpoint =
  | "getPriceCalendar"
  | "getNearByAirports"
  | "searchAirport"
  | "searchFlights";


const fetchFlightsData = async (endpoint: Endpoint, params: Params) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("API request error: ", error);
    throw error;
  }
};

export default fetchFlightsData;
