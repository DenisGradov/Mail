import { FaTimes } from 'react-icons/fa';
import PropTypes from "prop-types";

function RoundButton({onClick}) {
  return (
      <div onClick={onClick} className="p-[7px] bg-bg-active rounded-full hover-anim">
        <FaTimes className="text-icons text-[15px]" />
      </div>

  );
}
RoundButton.propTypes = {
  onClick: PropTypes.func,
}
export default RoundButton;