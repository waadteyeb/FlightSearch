import axios from "axios";

const API_URL = "https://sky-scrapper.p.rapidapi.com/api/v1/flights/";

const API_KEY = "6d14d0d209mshc150fff04cf9787p1a0937jsna16e2c4b9cc9";


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
