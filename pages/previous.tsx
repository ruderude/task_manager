import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { NextPage } from 'next';
import Link from 'next/link'

const Previous: NextPage = () => {
  const { data: session } = useSession({ required: true });

  return (
    <>
      {
        session && (
          <>
            <div>
              <h1>Previousようこそ, {session.user && session.user.email}</h1>
              <button onClick={() => signOut()}>ログアウト</button>
            </div>
            <div>
              <Link href={`/`}>現在のタスク</Link>
            </div>
          </>
        )
      }
      {
        !session && (
          <div>
            {/* <p>ログインが必要です</p>
            <button onClick={() => signIn()}>ログイン</button> */}
          </div>
        )
      }
    </>
  );
};

export default Previous;