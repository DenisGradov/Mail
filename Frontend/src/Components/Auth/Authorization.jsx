import { useState } from "react";
import Login from "./Login.jsx";
import Registration from "./Registration.jsx";

function Authorization() {
  const [authorizationState, setAuthorizationState] = useState("sign in");

  const changeAuthorizationState = () => {
    setAuthorizationState(authorizationState === "sign in" ? "sign up" : "sign in");
  };

  return (
    <>
      {authorizationState === "sign in" ? (
        <Login changeAuthorizationState={changeAuthorizationState} />
      ) : (
        <Registration changeAuthorizationState={changeAuthorizationState} />
      )}
    </>
  );
}

export default Authorization;