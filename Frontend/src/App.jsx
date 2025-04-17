import Login from "./Components/Auth/Login.jsx"
import {useEffect, useState} from "react";
import {useLoaderStore} from "./Store/Loader.js";
import Loader from "./Components/Ui/Loader.jsx";
import {useUserStore} from "./Store/User.js";
import MainWindow from "./Components/MainWindow.jsx";
import Authorization from "./Components/Auth/Authorization.jsx";
import TechnicalWorks from "./Components/Auth/TechnicalWorks.jsx";

function App() {
  const {auth, checkAuth, theme, user} = useUserStore();
  const {isLoading, showLoader, hideLoader} = useLoaderStore();


  useEffect(() => {
    const initialize = async () => {
      showLoader();
      await checkAuth();
      hideLoader();
    };
    initialize();
  }, [checkAuth, showLoader, hideLoader]);

  //console.log(user)

  return (
    <div className="w-full h-full absolute top-0 left-0  flex flex-col justify-center items-center">
      <div className={`${theme} min-h-screen  text-text-primary`}>
        {user.status === 503 ? <TechnicalWorks/> :


          <div
            className="top-0 left-0 absolute w-[100vw] h-[100vh] flex flex-col justify-center items-center bg-bg-main">
            {auth.isAuthenticated ? <MainWindow/> : <Authorization/>}
          </div>
        }
      </div>
      <div>
        {isLoading && <Loader/>}
      </div>
    </div>
  )
}

export default App
