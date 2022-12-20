import Router from "next/router";
import { useState, useEffect } from "react";
//  Firebase Client
import { authChange } from "/firebase/client.js";

export const USER_STATES = {
  NOT_LOGGED: null,
  NOT_KNOWN: undefined,
};

export default function useUser() {
  const [user, setUser] = useState(USER_STATES.NOT_KNOWN);

  useEffect(() => {
    authChange(setUser);
  }, []);

  useEffect(() => {
    user === USER_STATES.NOT_LOGGED && Router.push("/");
  }, [user]);
  return user;
}
