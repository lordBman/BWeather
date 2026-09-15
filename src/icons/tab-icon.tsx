import CalendarText from "./calendar-text";
import Cog from "./cog";
import Heart from "./heart";
import Home from "./home";

interface TabIconProps {
  icon: string;
  size?: number;
  color?: string;
}

const TabIcon = ({ icon, size, color }: TabIconProps) => {
    switch (icon) {
        case 'mdi:home':
            return <Home width={size} height={size} color={color} />;
        case 'mdi:calendar-text':
            return <CalendarText width={size} height={size} color={color} />;
        case 'mdi:cog':
            return <Cog width={size} height={size} color={color} />;
        case 'mdi:heart':
            return <Heart width={size} height={size} color={color} />;
        default:
            return null;
    }
};

export default TabIcon;