import Svg, { SvgProps, Path } from "react-native-svg"

const CalendarText = (props: SvgProps) => (
  <Svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      fill="currentColor"
      d="M14 14H7v2h7m5 3H5V8h14m0-5h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-2 7H7v2h10z"
    />
  </Svg>
)
export default CalendarText
