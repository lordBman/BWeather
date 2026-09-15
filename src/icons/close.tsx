import Svg, { SvgProps, Path } from "react-native-svg"

const Close = (props: SvgProps) => (
  <Svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      fill="currentColor"
      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    />
  </Svg>
)
export default Close
