import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export const SupabaseContext = React.createContext();

const user = supabase.auth.user();
const session = supabase.auth.session();

export const SupabaseContextProvider = ({ children }) => {
  const setFollowers = (val) => {
    setState((prev) => ({ ...prev, followers: val }));
  };

  const [state, setState] = useState({
    followers: null,
    setFollowers,
    getFollowers,
  });

  async function getFollowers() {
    if (!session) return;
    try {
      const { data, error } = await supabase
        .from("Followers")
        .select("*, profiles:followedUser (*)")
        .eq("followedBy", user.id);

      if (error) {
        throw error;
      }

      if (data.length !== 0) {
        setFollowers(data);
        console.log(data);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <SupabaseContext.Provider value={state}>
      {children}
    </SupabaseContext.Provider>
  );
};
