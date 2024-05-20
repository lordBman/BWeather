import * as React from 'react';
import { APIKEY } from '@env';
import { openWeatherAPI } from './connections';
import { useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { DarkTheme, LightTheme, Theme } from './themes';
import { PermissionsAndroid } from 'react-native';
import DefaultSettings, { AppSettings } from './settings';
import { Data } from './types';
import { useMutation } from 'react-query';

export interface Location{
    latitude: string, longitude: string, country: string, place: string
}


export interface State{
    loading: boolean, isError: boolean, message: any
}

export type AppContextType = {
    data?: Data;
    settings: AppSettings,
    state: State,
    load: (city: string) => void;
    toggleTheme:() => void;
    toggleUnits: () => void;
    refresh: ()=> void;
};

export const AppContext = React.createContext<AppContextType | null>(null);

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, setState] = useState<State>({loading: false, isError: false, message: ""});
    const [data, setData] = useState<Data>();
    const [settings, setSettings] = useState<AppSettings>(DefaultSettings);
    const [location, setLocation] = useState<Location>();

    // Function to get permission for location
    const initLocation = async () => {
        setState(init => { return { ...init, loading: true, isError: false, message: "Getting user current location"}});
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                title: 'Geolocation Permission', message: 'Can we access your location?', buttonNeutral: 'Ask Me Later', buttonNegative: 'Cancel', buttonPositive: 'OK'
            });
            
            if(granted === 'granted'){
                Geolocation.getCurrentPosition(
                    position =>{
                        reverseGeoMutation.mutate({ latitude: position.coords.latitude.toString(), longitude: position.coords.longitude.toString() });
                    },
                    error => {
                        console.log(error.code, error.message);
                        setState(init => { return { ...init, loading: false, isError: true, message: error }});
                        setLocation(undefined);
                    },
                    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000});
            }
        } catch (error) {
            console.log(error)
            setState(init => { return { ...init, loading: false, isError: true, message: error}});
        }
    };

    const temperatureMutation = useMutation({
        mutationKey: ["temperature"],
        onMutate:()=>setState(init => { return { ...init, loading: true, isError: false, message: "Gathering weather report,please wait"}}),
        mutationFn: (init:{lat: string, long: string}) => {
            return openWeatherAPI.get(`/data/3.0/onecall?lat=${init.lat}&lon=${init.long}&exclude=minutely&appid=${ APIKEY}&units=metric`);
        },
        onSuccess(data) {
            setState(init => { return { ...init, loading: false}});
            setData(data.data);
            //alert(JSON.stringify(data));
        },
        onError(error) {
            console.log("Forecast Error", error);
            setState(init => { return { ...init, loading: false, isError: true, message: `Unable to get forcast repost for ${location?.place}`}});
            //alert(`${import.meta.env.VITE_APIKEY} - ${JSON.stringify(error)}`);
        },
    });

    const geoMutation = useMutation({
        mutationKey: ["geoposition"],
        mutationFn: (query: string) => openWeatherAPI.get(`/geo/1.0/direct?q=${query}&limit=1&appid=${ APIKEY }`),
        onMutate:(variables)=>setState(init => { return { ...init, loading: true, isError: false, message: `Getting coordinates for location: ${variables}`}}),
        onSuccess(data) {
            //alert(JSON.stringify(data));
            setState(init => { return { ...init, loading: false}});
            setLocation({latitude: data.data[0].lat, longitude: data.data[0].lon, country: data.data[0].state || data.data[0].country, place: data.data[0].name});
        },
        onError(error, variables) {
            console.log("Geo position Error", error);
            //alert(`${import.meta.env.VITE_APIKEY} - ${JSON.stringify(error)}`);
            setState(init => { return { ...init, loading: false, isError: true, message: `Unable to geographical loction of ${variables}, either location is not in our database or network error`}});
        },
    });

    const reverseGeoMutation = useMutation({
        mutationKey: ["reverseGeoposition"],
        mutationFn: (coordinates: { longitude: string, latitude: string }) => openWeatherAPI.get(`/geo/1.0/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}&limit=1&appid=${ APIKEY }`),
        onMutate:()=>setState(init => { return { ...init, loading: true, isError: false, message: `Getting location details from user coordinates`}}),
        onSuccess(data) {
            setLocation({latitude: data.data[0].lat, longitude: data.data[0].lon, country: data.data[0].country, place: data.data[0].name});
        },
        onError(error, variables) {
            console.log("Geo position Error", error);
            setState(init => { return { ...init, loading: false, isError: true, message: `Unable to geographical loction of ${variables}, either location is not in our database or network error`}});
        },
    });

    const load = async (city: string) => geoMutation.mutate(city);
    const refresh = async () => temperatureMutation.mutate({lat: location!.latitude, long: location!.longitude});

    const init = React.useCallback(async ()=>{
        if(location){
            temperatureMutation.mutate({lat: location.latitude, long: location.longitude});
        }else{
            initLocation();
        }
    }, [location]);

    React.useEffect(()=> { init() }, [init, location]);

    const toggleTheme  = () =>{
        setSettings((init)=> {
            if(init.theme === "auto"){
                return {...init, theme: LightTheme };
            }else{
                return {...init, theme: init.theme.isLight ? DarkTheme : "auto" };   
            }
        });
    }

    const toggleUnits = () => setSettings((init)=>{ return {...init, unit: init.unit === "metric" ? "imperical" : "metric" }});

    return (<AppContext.Provider value={{ refresh, load, toggleTheme, state, settings, toggleUnits, ...state}}>{children}</AppContext.Provider>);
}

export default AppProvider;