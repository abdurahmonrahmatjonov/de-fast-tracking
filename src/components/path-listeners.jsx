import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PathListener() {
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname !== "/auth/login" &&
      location.pathname !== "/" &&
      location.pathname !== "/auth"
    ) {
      sessionStorage.setItem("prevLocation", location.pathname);
    }
  }, [location.pathname]);

  return null; 
}

export default PathListener;