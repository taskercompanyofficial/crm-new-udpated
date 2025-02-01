"use server";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

export const fetchSuggestions = async (query: string) => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || !query) {
    console.log("Missing API key or empty query");
    console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    console.log(query);
    return [];
  }

  try {
    const response = await client.placeAutocomplete({
      params: {
        input: query,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      },
    });

    if (!response.data.predictions) {
      console.log("No predictions found in response");
      return [];
    }

    return response.data.predictions;
  } catch (error) {
    console.log("Error fetching Google Places suggestions:", error);
    return [];
  } 
};
