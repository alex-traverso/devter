import { colors } from "../../styles/theme";
const SVGComponent = (props) => (
  <svg
    width='24px'
    height='24px'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    stroke={props}
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='feather feather-trash'
    {...props}
  >
    <polyline points='3 6 5 6 21 6' />
    <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
    <style jsx>{`
      svg:hover {
        stroke: ${colors.red};
        transition: all 0.3s;
      }
    `}</style>
  </svg>
);
export default SVGComponent;
