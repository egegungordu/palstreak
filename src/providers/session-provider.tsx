import { Session } from "next-auth";
import { SessionProvider as _SessionProvider } from "next-auth/react";

export default function SessionProvider({ children, session }: { children: React.ReactNode, session: Session | null }) {
  return (
    <_SessionProvider session={session}>
      {children}
    </_SessionProvider>
  );
}
