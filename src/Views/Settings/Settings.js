import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

import Account from "../../Components/Account/Account";
import "./Settings.css";
import LoadingIcon from "../../Components/LoadingIcon/LoadingIcon";

export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="profile-settings">
      <div className="settings-container">
        {!session ? (
          <LoadingIcon />
        ) : (
          <Account key={session.user.id} session={session} />
        )}
      </div>
    </div>
  );
}
