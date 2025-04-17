import SmallLogo from "./SmallLogo.jsx";

function Logo() {
  return (
    <div className="flex justify-center items-center select-none">
      <SmallLogo/>
      <h2 className="ml-[13px]  text-prim text-[29px] font-bold">Kvantomail</h2>

    </div>
  );
}

export default Logo;