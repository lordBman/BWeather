import Svg, { SvgProps, Path } from "react-native-svg"

const Home = (props: SvgProps) => (
  <Svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </Svg>
)
export default Home
