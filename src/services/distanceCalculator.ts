import { request } from "http";
import { User } from "../entity";
import axios from "axios";

// https://maps.googleapis.com/maps/api/distancematrix/json?origins=Westendelaan%20166,%20Middelkerke,%20Belgium&destinations=Camille%20Huysmansstraat%2019,%20Baal,%20Belgium&key=AIzaSyAwokyR92AKlvThfnglg2F2uUhgTvl2krQ

const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
const apiKey = "AIzaSyAwokyR92AKlvThfnglg2F2uUhgTvl2krQ";

const distanceListCalculator = async (user: User, users: User[]): Promise<number[]> => {
    const response = await axios.get(url, {
        params: {
            origins: `${user.address},${user.city},${user.country}`,
            destinations: users.map((user) => `${user.address},${user.city},${user.country}`).join('|'),
            key: apiKey
        }
    });
    
    const distances = response.data.rows[0].elements.map((element: any) => element.distance.value);

    return distances;
}

export { distanceListCalculator };