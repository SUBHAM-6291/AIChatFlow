'use client'

import { useSession, signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth"; // Optional: for stricter typing

export default function Component() {
  const { data: session } = useSession();

  // Type assertion for session - optional but provides better type safety
  const typedSession = session as Session | null;

  if (typedSession) {
    return (
      <div>
        <p>Signed in as {typedSession.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <p>Not signed in</p>
      <button className="bg-orange-500 p-3 px-3 py-2 m-4 rounded-md " onClick={() => signIn()}>Sign in</button>
    </div>
  );
}