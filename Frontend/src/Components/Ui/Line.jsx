import PropTypes from "prop-types";

function Line({className, type = "Small"}) {
  return (
    <div className={`${className} ${type==="Long"?"w-[2000px]":"w-full"}  h-[1px] bg-stroke`}></div>
  );
}

Line.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
}
export default Line;