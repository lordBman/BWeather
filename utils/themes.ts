export interface Theme{
    primaryColor: string
    backgroundColor: string,
    isLight: boolean
}

export const LightTheme: Theme = { primaryColor: "#3467ff", backgroundColor: "white", isLight: true }
export const DarkTheme: Theme = { primaryColor: "#3467ff", backgroundColor: "#220012", isLight: false }