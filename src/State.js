import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export const SupabaseContext = React.createContext();

export const SupabaseContextProvider = ({ children }) => {
  const setFollowers = (val) => {
    setState((prev) => ({ ...prev, followers: val }));
  };

  const [state, setState] = useState({
    followers: null,
    setFollowers,
    getFollowers,
    setFollowers,
  });

  async function getFollowers() {
    const user = supabase.auth.user();
    const session = supabase.auth.session();
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
