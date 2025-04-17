
function TechnicalWorks() {
  return (
    <div className="w-full h-full absolute top-0 left-0 bg-bg-main">
      <div className="w-full h-full absolute top-0 left-0 bg-bg-main flex flex-col justify-center items-center">
        <img className=" w-[184px] bg-primary p-[32px] logo-bg rounded-[58px]" src="icons/logo.svg" alt="logo"/>
        <h3 className="font-bold text-[96px] text-text-primary">503</h3>
        <h3 className="font-bold text-[40px] text-text-primary">Technical work</h3>
        <h3 className="font-normal text-[20px] text-text-secondary-60">Try again later</h3>
      </div>
      <img
        src="globeEffect.png"
        className="absolute top-0 left-0 w-full h-full"
        alt="bg"
      />
    </div>
  );
}

export default TechnicalWorks;