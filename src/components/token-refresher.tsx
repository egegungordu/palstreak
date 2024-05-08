"use client";

import { useSession } from "next-auth/react";
import { useLayoutEffect, useRef } from "react";

// this component is used to refresh the token when user logs in.
// because we use jwts to display the user's data, we need to refresh the token
// incase the user details change on a different device/browser.
export default function TokenRefresher() {
  const { status, update } = useSession();
  const hasUpdated = useRef(false);

  useLayoutEffect(() => {
    if (hasUpdated.current) {
      return;
    }
    if (status === "authenticated") {
      hasUpdated.current = true;
      update({});
    }
  }, [status, update]);

  return null;
}
