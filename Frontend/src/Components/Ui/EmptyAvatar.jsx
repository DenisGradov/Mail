import PropTypes from "prop-types";
import { useUserStore } from "../../Store/Index.js";

function EmptyAvatar({ name = "", className = "", onClick, otherUser = false, userData = null, mode = "avatar" }) {
  const firstLetter = name ? name[0] : "N";
  const { user } = useUserStore();

  const avatar = otherUser ? userData?.avatar : user.avatar;
  const showAvatar = mode === "avatar" && (otherUser ? (userData?.avatar && userData?.avatar !== "none") : (user.avatar && user.avatar !== "none"));

  if (mode === "placeholder") {
    return (
      <div
        onClick={onClick}
        className={`${className} text-pink-600 pt-[3.57px] pb-[3.43px] pl-[9.96px] pr-[10.04px] rounded-[8px] bg-pink-200 w-[29px] hover-anim`}
      >
        {firstLetter}
      </div>
    );
  }

  return (
    <div>
      {showAvatar ? (
        <img
          src={avatar}
          onClick={onClick}
          className="w-[40px] h-[40px] p-[3px] rounded-[10px] hover-anim"
          alt="userAvatar"
        />
      ) : (
        <div
          onClick={onClick}
          className={`${className} text-pink-600 pt-[3.57px] pb-[3.43px] pl-[9.96px] pr-[10.04px] rounded-[8px] bg-pink-200 w-[29px] hover-anim`}
        >
          {firstLetter}
        </div>
      )}
    </div>
  );
}

EmptyAvatar.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  otherUser: PropTypes.bool,
  userData: PropTypes.object,
  mode: PropTypes.oneOf(["avatar", "placeholder"]),
};

export default EmptyAvatar;