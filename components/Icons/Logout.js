import * as React from "react";
const SVGComponent = (props) => (
  <svg
    width={props}
    height={props}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M14 4L18 4C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H14M3 12L15 12M3 12L7 8M3 12L7 16'
      stroke={props}
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
export default SVGComponent;

/* import * as React from "react";

const SvgComponent = (props) => (
  <svg
    width={props}
    height={props}
    fill={props}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M5.833 5a.833.833 0 1 0 0-1.667H4.167a.833.833 0 0 0-.834.834v11.666a.833.833 0 0 0 .834.834h1.666a.834.834 0 0 0 0-1.667H5V5h.833ZM17.35 9.517 15 6.183a.833.833 0 1 0-1.358.967l1.433 2.017H8.333a.833.833 0 1 0 0 1.666H15l-1.5 2a.834.834 0 0 0 1.333 1l2.5-3.333a.833.833 0 0 0 .017-.983Z' />
  </svg>
);

export default SvgComponent;
 */
