import WeatherCloudy from "./weather-cloudy";
import WeatherFog from "./weather-fog";
import WeatherHail from "./weather-hail";
import WeatherLightning from "./weather-lightning";
import WeatherLightningRainy from "./weather-lightning-rainy";
import WeatherNight from "./weather-night";
import WeatherNightPartlyCloudy from "./weather-night-partly-cloudly";
import WeatherPartlyCloudy from "./weather-partly-cloudy";
import WeatherPartlyRainy from "./weather-partly-rainy";
import WeatherPartlySnowy from "./weather-partly-snowy";
import WeatherPouring from "./weather-pouring";
import WeatherRainy from "./weather-rainy";
import WeatherSnowy from "./weather-snowy";
import WeatherSnowyHeavy from "./weather-snowy-heavy";
import WeatherSunny from "./weather-sunny";
import WeatherWindy from "./weather-windy";

interface WeatherIconProps {
    icon: string;
    size?: number;
    color?: string;
}

const WeatherIcon = ({ icon, size = 24, color }: WeatherIconProps) => {
    switch (icon) {
        case 'mdi:weather-sunny':
            return <WeatherSunny width={size} height={size} color={color} />;
        case 'mdi:weather-night':
            return <WeatherNight width={size} height={size} color={color} />;
        case 'mdi:weather-partly-cloudy':
            return <WeatherPartlyCloudy width={size} height={size} color={color} />;
        case 'mdi:weather-night-partly-cloudy':
            return <WeatherNightPartlyCloudy width={size} height={size} color={color} />;
        case 'mdi:weather-cloudy':
            return <WeatherCloudy width={size} height={size} color={color} />;
        case 'mdi:weather-fog':
            return <WeatherFog width={size} height={size} color={color} />;
        case 'mdi:weather-rainy':
            return <WeatherRainy width={size} height={size} color={color} />;
        case 'mdi:weather-hail':
            return <WeatherHail width={size} height={size} color={color} />;
        case 'mdi:weather-pouring':
            return <WeatherPouring width={size} height={size} color={color} />;
        case 'mdi:weather-snowy':
            return <WeatherSnowy width={size} height={size} color={color} />;
        case 'mdi:weather-snowy-heavy':
            return <WeatherSnowyHeavy width={size} height={size} color={color} />;
        case 'mdi:weather-partly-rainy':
            return <WeatherPartlyRainy width={size} height={size} color={color} />;
        case 'mdi:weather-partly-snowy':
            return <WeatherPartlySnowy width={size} height={size} color={color} />;
        case 'mdi:weather-lightning':
            return <WeatherLightning width={size} height={size} color={color} />;
        case 'mdi:weather-lightning-rainy':
            return <WeatherLightningRainy width={size} height={size} color={color} />;
        case 'mdi:weather-windy':
            return <WeatherWindy width={size} height={size} color={color} />;
        default:
            return <WeatherCloudy width={size} height={size} color={color} />;
    }
}

export default WeatherIcon;