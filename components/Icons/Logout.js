import * as React from "react";

const SvgComponent = (props) => (
  <svg
    width={20}
    height={20}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M5.833 5a.833.833 0 1 0 0-1.667H4.167a.833.833 0 0 0-.834.834v11.666a.833.833 0 0 0 .834.834h1.666a.834.834 0 0 0 0-1.667H5V5h.833ZM17.35 9.517 15 6.183a.833.833 0 1 0-1.358.967l1.433 2.017H8.333a.833.833 0 1 0 0 1.666H15l-1.5 2a.834.834 0 0 0 1.333 1l2.5-3.333a.833.833 0 0 0 .017-.983Z' />
  </svg>
);

export default SvgComponent;
