import React, { useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import styles from '@/styles/Login.module.scss'

const Login: NextPage = () => {
  const { data: session } = useSession()

  // sessionがあれば「/」にリダイレクト
  const router = useRouter()
  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session])

  return (
    <div className={styles.main}>
      <div className={styles.login_area}>
        <h1 className={styles.login_title}>タスク管理アプリ</h1>
        <button onClick={() => signIn("google")} className={styles.login_btn}>ログイン</button>
      </div>
    </div>
  )
}

export default Login