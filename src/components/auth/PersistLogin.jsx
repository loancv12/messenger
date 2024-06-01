import React from "react";
import usePersist from "../../hooks/usePersist";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/auth/authSlice";

const PersistLogin = () => {
  const persist = usePersist();
  const token = useSelector(selectToken);

  return <div>PersistLogin</div>;
};

export default PersistLogin;
