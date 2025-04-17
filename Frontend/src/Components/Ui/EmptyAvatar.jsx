import PropTypes from "prop-types";

function EmptyAvatar({name, className}) {
  const firstLetter = (name? name[0] : "N")
  return (
    <div className={`${className} text-pink-600 pt-[3.57px] pb-[3.43px] pl-[9.96px] pr-[10.04px] rounded-[8px] bg-pink-200 w-[29px]`}>{firstLetter}</div>
  );
}

EmptyAvatar.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
}
export default EmptyAvatar;