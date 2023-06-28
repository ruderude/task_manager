import React, { useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { NextPage } from 'next';

const Login: NextPage = () => {
  const { data: session } = useSession({ required: true })

  // sessionがあれば「/」にリダイレクト
  useEffect(() => {
    if (session) {
      window.location.href = '/';
    }
  }
  , [session])

  return (
    <>
    </>
  );
};

export default Login;