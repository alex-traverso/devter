import { colors } from "../../styles/theme";

const LenghtCount = ({ strokeWidth, percentage, width, height, fontsize }) => {
  const radius = 50 - strokeWidth / 2;
  const pathDescription = `
      M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;

  const operatorLength =
    percentage >= 0 && percentage <= 99
      ? colors.primary
      : percentage >= 100 && percentage <= 119
      ? colors.yellow
      : percentage > 120 && colors.red;

  const diameter = Math.PI * 2 * radius;
  const progressStyle = {
    stroke: operatorLength,
    strokeLinecap: "round",
    strokeDasharray: `${diameter}px ${diameter}px`,
    strokeDashoffset: `${((140 - percentage) / 140) * diameter}px`,
  };

  return (
    <svg
      className={"CircularProgressbar"}
      viewBox='0 0 100 100'
      width={width}
      height={height}
    >
      <path
        className='CircularProgressbar-trail'
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        style={{
          stroke: "#d6d6d6",
        }}
      />
      <path
        className='CircularProgressbar-path'
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        style={progressStyle}
      />
    </svg>
  );
};

export default LenghtCount;
