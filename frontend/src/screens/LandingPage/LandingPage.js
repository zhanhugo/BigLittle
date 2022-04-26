import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function LandingPage({ history }) {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      history.push("/home");
    } else {
      window.location.href = "https://biglittle.squarespace.com/";
    }
  }, [history, userInfo]);

  return (
    <div>
      <h2>Redirecting...</h2>
    </div>
  );
}

export default LandingPage;
