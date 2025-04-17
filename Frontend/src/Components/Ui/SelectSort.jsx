const SelectSort = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="bg-input border border-stroke rounded-md p-[5px] text-text-primary text-sm cursor-pointer outline-none hover:border-primary duration-200"
    >
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
      <option value="az">A - Z</option>
      <option value="za">Z - A</option>
    </select>
  );
};


export default SelectSort;
