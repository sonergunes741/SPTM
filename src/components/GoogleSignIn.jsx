import { useEffect } from "react";

export default function GoogleSignIn() {
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    });
  }, []);

  return <div id="google-signin-button"></div>;
}
