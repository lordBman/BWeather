import Svg, { SvgProps, Path } from "react-native-svg"
const MapMarker = (props: SvgProps) => (
  <Svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      fill="currentColor"
      d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"
    />
  </Svg>
)
export default MapMarker
