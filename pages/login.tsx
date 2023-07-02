import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import styles from '@/styles/Login.module.scss'

const Login: NextPage = () => {
  const { data: session, status } = useSession()
  const [isDisabled, setDisabled] = useState<boolean>(false)

  // sessionがあれば「/」にリダイレクト
  const router = useRouter()

  const loadingNode = () => {
    return (
      <div className={styles.main_loading}>
        <div className={styles.loading}></div>
        <p>Now loading...</p>
      </div>
    )
  }

  const doLogin = () => {
    setDisabled(true)
    signIn("google", { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}` })
  }

  useEffect(() => {
    if (session) {
      router.push('/')
      return
    }
  }, [session])

  if (status === "loading") {
    return loadingNode()
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
              <button onClick={() => doLogin()} className={`${isDisabled ? styles.disabled : ""} ${styles.login_btn}`} disabled={isDisabled}>Googleログイン</button>
          </div>
        </div>
      }
    </>
  )
}

export default Login