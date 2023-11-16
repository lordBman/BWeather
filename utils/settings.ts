import { Theme } from "./themes";

export interface AppSettings{
    unit: "metric" | "imperical",
    theme: Theme | "auto"
}

const DefaultSettings: AppSettings = { unit: "metric", theme: "auto" }

export default DefaultSettings;

