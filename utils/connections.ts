import axios from "axios";

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