import { useMailStore } from "../../Store/Index.js";
import { getDate, getShortText, stripHtml } from "../../Utils/Main.js";
import { FaBookmark, FaRegBookmark, FaCheckSquare, FaRegSquare } from "react-icons/fa";

function MailList({
                    isMailOpen,
                    activeTab,
                    displayedMails,
                    selectedMails,
                    handleSelectMails,
                    handleMailOpen,
                    handleContextWindowOpen,
                    toggleFavorite,
                    isDesktop,
                  }) {
  return (
    <div className="overflow-y-auto max-h-[calc(100vh-80px)] px-[16px] py-[20px]">
      <div className="mx-auto w-full px-[5px] overflow-y-auto overflow-x-hidden m-[10px]">
        {displayedMails.map((mail, mailIndex) => (
          <div key={`Mail #${mailIndex}`} className="w-full mx-[10px] px-[10px] pr-[25px]">
            <div
              onClick={() => handleMailOpen(mail)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleContextWindowOpen([mail.id], e.clientX, e.clientY);
              }}
              className="hover:scale-100 hover:bg-bg-hover hover-anim cursor-pointer py-[10px]"
            >
              {isDesktop ? (
                <div className="flex items-center">
                  <div className="flex items-center flex-[25%]">
                    {selectedMails.includes(mail.id) ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectMails("id", mail.id);
                        }}
                        className="cursor-pointer"
                      >
                        <FaCheckSquare className="text-icons text-[19px] hover-anim" />
                      </div>
                    ) : (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectMails("id", mail.id);
                        }}
                        className="cursor-pointer"
                      >
                        <FaRegSquare className="text-icons text-[19px] hover-anim" />
                      </div>
                    )}
                    {activeTab !== "Sent" && (
                      <div
                        className="ml-[10px] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(mail.id, !mail.favorite);
                        }}
                      >
                        {mail.favorite ? (
                          <FaBookmark className="text-yellow-400" />
                        ) : (
                          <FaRegBookmark />
                        )}
                      </div>
                    )}
                    <div
                      className={`${
                        mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"
                      } text-[17px] ml-[10px]`}
                    >
                      {getShortText(activeTab === "Sent" ? mail.to : mail.from || "none", 30, false)}
                    </div>
                  </div>
                  <div className="flex items-center flex-[60%]">
                    {activeTab !== "Sent" && (
                      <div
                        className={`${
                          mail.viewed ? "opacity-0" : "opacity-100"
                        } w-[8px] h-[8px] rounded-full bg-primary`}
                      />
                    )}
                    <div
                      className={`${
                        mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"
                      } mx-[10px] text-[17px]`}
                    >
                      {getShortText(mail.subject || "Без темы", 30, false)}
                    </div>
                    <div
                      className={`${
                        mail.viewed
                          ? "font-medium text-text-secondary"
                          : "font-bold text-text-secondary-60"
                      } text-[17px]`}
                    >
                      {getShortText(mail.text || stripHtml(mail.html) || "No text", 70, true)}
                    </div>
                  </div>
                  <div className="flex-[0.5%] text-center">{getDate(mail.date)}</div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center">
                      <div
                        className={`${
                          mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"
                        } text-[17px]`}
                      >
                        {getShortText(mail.from || "none", 18, false)}
                      </div>
                    </div>
                    <div
                      className={`${
                        mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"
                      } text-[17px] mt-[4px]`}
                    >
                      {getShortText(mail.subject || "Без темы", 20, false)}
                    </div>
                    <div
                      className={`${
                        mail.viewed
                          ? "font-medium text-text-secondary"
                          : "font-bold text-text-secondary-60"
                      } text-[17px] mt-[4px]`}
                    >
                      {getShortText(mail.text || stripHtml(mail.html) || "No text", 20, true)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full bg">
                    <div className="flex items-center">
                      {selectedMails.includes(mail.id) ? (
                        <div onClick={() => handleSelectMails("id", mail.id)} className="cursor-pointer">
                          <FaCheckSquare className="text-icons text-[19px] hover-anim" />
                        </div>
                      ) : (
                        <div onClick={() => handleSelectMails("id", mail.id)} className="cursor-pointer">
                          <FaRegSquare className="text-icons text-[19px] hover-anim" />
                        </div>
                      )}
                      <div className="ml-2 cursor-pointer">
                        {mail.favorite ? (
                          <FaBookmark
                            className="text-yellow-400"
                            onClick={() => toggleFavorite(mail.id, false)}
                          />
                        ) : (
                          <FaRegBookmark onClick={() => toggleFavorite(mail.id, true)} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`${
                          mail.viewed ? "opacity-0" : "opacity-100"
                        } w-[8px] h-[8px] rounded-full bg-primary`}
                      />
                      <div className="ml-[10px]">{getDate(mail.date)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={`w-full h-[1px] bg-stroke`} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default MailList;