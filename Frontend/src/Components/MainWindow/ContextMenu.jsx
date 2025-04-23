import { FaTrashAlt, FaEye } from "react-icons/fa";
import Line from "../Ui/Line.jsx";

function ContextMenu({ isContextWindowOpen, handleContextAction }) {
  if (!isContextWindowOpen.state) return null;

  return (
    <div
      className="absolute 840px:ml-[-240px] mt-[-20px] bg-container z-50 p-[5px] rounded-[10px] border border-stroke"
      style={{ top: isContextWindowOpen.y, left: isContextWindowOpen.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="flex items-center p-[4px] cursor-pointer hover-anim"
        onClick={() => handleContextAction("delete")}
      >
        <FaTrashAlt className="text-icons text-[16px]" />
        <span className="ml-[5px] text-icons text-[16px]">Delete</span>
      </div>
      <Line />
      <div
        className="flex items-center p-[4px] cursor-pointer hover-anim"
        onClick={() => handleContextAction("read")}
      >
        <FaEye className="text-icons text-[16px]" />
        <span className="ml-[5px] text-icons text-[16px]">Read</span>
      </div>
    </div>
  );
}

export default ContextMenu;