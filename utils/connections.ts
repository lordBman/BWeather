import axios from "axios";

export const apiKey = "5339176bef3c8725c8a9c64ccb7d985f";
export const imageSrc = (name:string) => `https://openweathermap.org/img/wn/${name}@2x.png`;

export const openWeatherAPI =  axios.create({
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded' 
	},
	baseURL: "https://api.openweathermap.org", });
    
export const openWeatherImages =  axios.create({
    headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
    },
    baseURL: "https://openweathermap.org/img/wn", });