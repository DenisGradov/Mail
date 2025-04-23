import { FaTrashAlt, FaBookmark, FaRegBookmark, FaCheckSquare, FaRegSquare, FaEllipsisV, FaSync } from "react-icons/fa";

function MailActions({
                       isMailOpen,
                       selectedMails,
                       displayedMails,
                       handleSelectMails,
                       handleContextWindowOpen,
                       handleMailUpdate,
                       isMailOpenData,
                       activeTab,
                       toggleFavorite,
                     }) {
  return (
    <div className="flex items-center ml-[12px]">
      {!isMailOpen ? (
        <div className="flex items-center">
          {selectedMails.length === displayedMails.length ? (
            <div onClick={() => handleSelectMails("all")} className="hover-anim cursor-pointer">
              <FaCheckSquare className="text-icons text-[19px] m-[8px]" />
            </div>
          ) : (
            <div onClick={() => handleSelectMails("all")} className="hover-anim cursor-pointer">
              <FaRegSquare className="text-icons text-[19px] m-[8px]" />
            </div>
          )}
          <div className="hover-anim cursor-pointer">
            <FaEllipsisV
              onClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                handleContextWindowOpen(selectedMails, rect.left, rect.bottom);
              }}
              className="text-icons text-[19px]"
            />
          </div>
          <div onClick={handleMailUpdate} className="hover-anim cursor-pointer">
            <FaSync className="text-icons text-[19px] m-[8px]" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <FaTrashAlt className="text-icons text-[20px] hover-anim cursor-pointer" />
          {activeTab !== "Sent" && (
            <div className="ml-[10px] cursor-pointer">
              {isMailOpenData.favorite ? (
                <FaBookmark
                  onClick={() => toggleFavorite(isMailOpenData.id, false)}
                  className="text-yellow-400"
                />
              ) : (
                <FaRegBookmark onClick={() => toggleFavorite(isMailOpenData.id, true)} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MailActions;