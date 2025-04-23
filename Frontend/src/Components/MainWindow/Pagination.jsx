import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SelectSort from "../Ui/SelectSort.jsx";

function Pagination({
                      isMailOpen,
                      sortType,
                      handleSortChange,
                      currentPage,
                      totalPages,
                      rangeStart,
                      rangeEnd,
                      filteredMails,
                      handlePrevPage,
                      handleNextPage,
                      openIndex,
                      openTotal,
                      handlePrevMail,
                      handleNextMail,
                    }) {
  return (
    <div className="flex items-center justify-center space-x-3 select-none mr-[65px]">
      {!isMailOpen ? (
        <>
          <SelectSort value={sortType} onChange={handleSortChange} />
          <div className="flex items-center ml-[3px]">
            <FaArrowLeft
              onClick={handlePrevPage}
              className={`hover-anim cursor-pointer ${currentPage === 1 && "opacity-40 pointer-events-none"}`}
            />
            <span className="text-text-secondary text-[15px] mx-[3px]">
              {`${rangeStart}-${rangeEnd} from ${filteredMails.length}`}
            </span>
            <FaArrowRight
              onClick={handleNextPage}
              className={`hover-anim cursor-pointer z-40 ${
                currentPage === totalPages && "opacity-40 pointer-events-none"
              }`}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center space-x-4">
          <FaArrowLeft
            onClick={handlePrevMail}
            className={`text-[20px] hover-anim cursor-pointer ${
              openIndex === 1 ? "opacity-40 pointer-events-none" : ""
            }`}
          />
          <span className="text-text-secondary text-[15px]">{`${openIndex} of ${openTotal}`}</span>
          <FaArrowRight
            onClick={handleNextMail}
            className={`text-[20px] hover-anim cursor-pointer z-40 ${
              openIndex === openTotal ? "opacity-40 pointer-events-none" : ""
            }`}
          />
        </div>
      )}
    </div>
  );
}

export default Pagination;