import Svg, { SvgProps, Path } from "react-native-svg"

const WeatherHail = (props: SvgProps) => (
  <Svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      fill="currentColor"
      d="M6 14a1 1 0 0 1 1 1 1 1 0 0 1-1 1 5 5 0 0 1-5-5 5 5 0 0 1 5-5c1-2.35 3.3-4 6-4 3.43 0 6.24 2.66 6.5 6.03L19 8a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-1a1 1 0 0 1-1-1 1 1 0 0 1 1-1h1a2 2 0 0 0 2-2 2 2 0 0 0-2-2h-2V9a5 5 0 0 0-5-5C9.5 4 7.45 5.82 7.06 8.19 6.73 8.07 6.37 8 6 8a3 3 0 0 0-3 3 3 3 0 0 0 3 3m4 4a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2m4.5-2a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5 1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5m-4-4a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5A1.5 1.5 0 0 1 9 13.5a1.5 1.5 0 0 1 1.5-1.5"
    />
  </Svg>
)
export default WeatherHail
