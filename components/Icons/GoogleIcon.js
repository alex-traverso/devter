import * as React from "react";
const SVGComponent = (props) => (
  <svg
    id='Capa_1'
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
    height={props}
    width={props}
    fill={props}
    x='0px'
    y='0px'
    viewBox='0 0 210 210'
    style={{
      enableBackground: "new 0 0 210 210",
    }}
    xmlSpace='preserve'
    {...props}
  >
    <path d='M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40 c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105 S0,162.897,0,105z' />
  </svg>
);
export default SVGComponent;