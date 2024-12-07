import type { Route } from "./+types/home";
import FlightSearchForm from "../flightsearch/flightsearch";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to Flight Search App!" },
  ];
}

export default function Home() {
  return <FlightSearchForm />
  
  
}
