import { colors } from "../../styles/theme";
const SVGComponent = (props) => (
  <svg
    width='24px'
    height='24px'
    viewBox='0 0 32 32'
    enableBackground='new 0 0 32 32'
    id='Stock_cut'
    xmlSpace='preserve'
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
    {...props}
  >
    <desc />
    <path
      d='M28.343,17.48L16,29  L3.657,17.48C1.962,15.898,1,13.684,1,11.365v0C1,6.745,4.745,3,9.365,3h0.17c2.219,0,4.346,0.881,5.915,2.45L16,6l0.55-0.55  C18.119,3.881,20.246,3,22.465,3h0.17C27.255,3,31,6.745,31,11.365v0C31,13.684,30.038,15.898,28.343,17.48z'
      fill={props}
      stroke={props}
      strokeLinejoin='round'
      strokeMiterlimit={10}
      strokeWidth={2}
    />
    <style jsx>{`
      svg:hover {
        stroke: ${colors.red};
        transition: all 0.3s;
      }
    `}</style>
  </svg>
);
export default SVGComponent;
