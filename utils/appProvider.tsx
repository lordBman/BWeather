import * as React from 'react';
import { Result, AppContextType } from './types';
import { apiKey, openWeatherAPI } from './connections';
import { useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { DarkTheme, LightTheme, Theme } from './themes';
import { PermissionsAndroid } from 'react-native';
import DefaultSettings, { AppSettings } from './settings';

export const AppContext = React.createContext<AppContextType | null>(null);

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, setState] = useState<{result?: Result, loading: boolean, isError: boolean, error: any }>({loading: false, isError: false, error: ""});
    const [settings, setSettings] = useState<AppSettings>(DefaultSettings);
    const [location, setLocation] = useState<Geolocation.GeoPosition>();

    // Function to get permission for location
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                title: 'Geolocation Permission', message: 'Can we access your location?', buttonNeutral: 'Ask Me Later', buttonNegative: 'Cancel', buttonPositive: 'OK'
            });
            return granted === 'granted';
        } catch (error) {
            console.log(error)
            setState(init => { return { ...init, loading: false, isError: true, error}});
            return false;
        }
    };

    // function to check permissions and get Location
    const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    position => setLocation(position),
                    error => {
                        console.log(error.code, error.message);
                        setState(init => { return { ...init, loading: false, isError: true, error}});
                        setLocation(undefined);
                    },
                    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000});
            }
        });
        console.log(location);
    };

    const init = React.useCallback(async ()=>{
        if(location){
            setState(init => { return { ...init, loading: true, isError: false, error: ""}});
            try{
                const data = (await openWeatherAPI.get(`/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${apiKey}&units=metric`)).data;
            
                setState(init => { return { ...init, result: data, loading: false}});
            }catch(error){
                setState(init => { return { ...init, loading: false, isError: true, error}});
            }
        }else{
            getLocation();
        }
    }, [location]);

    React.useEffect(()=> { init() }, [init, location]);

    const load = async (city: string) => {
        setState(init => { return { ...init, loading: true, isError: false, error: ""}});
        try{
            const location = (await openWeatherAPI.get(`/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)).data;
            const data = (await openWeatherAPI.get(`/data/2.5/forecast?lat=${location[0].lat}&lon=${location[0].lon}&appid=${apiKey}&units=metric`)).data;
            
            setState(init => { return { ...init, result: data, loading: false}});
        }catch(error){
            setState(init => { return { ...init, loading: false, isError: true, error}});
        }
    }

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

    return (<AppContext.Provider value={{ load, toggleTheme, settings, toggleUnits, ...state}}>{children}</AppContext.Provider>);
}

export default AppProvider;