import { supabase } from "../../supabaseClient";
import Account from "../../Components/Account/Account";

export default function Settings() {
  const session = supabase.auth.session();

  return (
    <div className="profile-settings">
      <div className="settings-container">
        <Account key={session.user.id} session={session} />
      </div>
    </div>
  );
}
