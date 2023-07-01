import React, { useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import styles from '@/styles/Login.module.scss'

const Login: NextPage = () => {
  const { data: session, status } = useSession()

  // sessionがあれば「/」にリダイレクト
  const router = useRouter()
  useEffect(() => {
    if (session) {
      router.push('/')
      return
    }
  }, [session])

  if (status === "loading") {
    return <div></div>
  }

  return (
    <>
      {
        session ? 
          <div></div>
        :
        <div className={styles.main}>
          <div className={styles.login_area}>
            <h1 className={styles.login_title}>タスク管理アプリ</h1>
            <br />
              <button onClick={() => signIn("google", { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`})} className={styles.login_btn}>Googleログイン</button>
          </div>
        </div>
      }
    </>
  )
}

export default Login