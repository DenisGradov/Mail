import Line from "./Line.jsx";
import RoundButton from "./RoundButton.jsx";
import {FaSignOutAlt} from "react-icons/fa";
import PropTypes from "prop-types";

function Clarification({title, text, onClick, buttonText, backButtonClick}) {
  return (
    <div className="z-40 flex flex-col absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-container max-w-[382px] w-full pt-[20px] rounded-[24px]">
      <div className="flex justify-between items-center px-[24px] ">
        <div className="text-text-primary text-[24px] font-bold">Confirm the action</div>
        <RoundButton onClick={backButtonClick}/>
      </div>
      <Line className=" mt-[20px]"/>
      <div className=" my-[20px] mx-[24px] py-[14px] px-[20px] bg-input rounded-[10px]">
        <div className="flex items-center">
          <FaSignOutAlt className="mr-[6px] text-[18px] text-red-500"/>
          <div className="text-text-primary text-[16px] font-medium">{title}</div>
        </div>
        <div className="mt-[10.5px] text-[15px] text-text-secondary">{text}</div>
      </div>
      <div className="flex justify-center items-center my-[20px] mx-[24px]">
        <button onClick={backButtonClick} className="flex items-center p-[12px] bg-bg-active text-text-secondary rounded-[10px] w-[176px] text-center justify-center mr-[10px] hover-anim">Cancel</button>
        <button onClick={onClick} className="flex items-center p-[12px] bg-red-500 text-[#fff] rounded-[10px] w-[176px] text-center justify-center">{buttonText}</button>
      </div>
    </div>
  );
}

Clarification.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  buttonText: PropTypes.string,
  backButtonClick: PropTypes.func,
  onClick: PropTypes.func,
}
export default Clarification;