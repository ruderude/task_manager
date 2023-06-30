import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import styles from '@/styles/Home.module.scss'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface UserProps {
  id: string | null
  name: string | null
  email: string | null
  emailVerified: boolean | null
  image: string | null
}

interface TaskProps {
  title: string
  done: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

const initialUser = {
  id: null,
  name: null,
  email: null,
  emailVerified: null,
  image: null,
}

export default function Home() {
  const { data: session } = useSession({ required: true })
  // const session = true
  const [user, setUser] = useState<UserProps>(initialUser)
  const [tasks, setTasks] = useState<any>([])

  useEffect(() => {
    console.log('useEffect')
    // console.log('session', session)
    const email = session?.user?.email ?? ''
    // const email = 'rude1979@gmail.com'
    const protocol = window.location.protocol
    const host = window.location.host
    const url = protocol + "//" + host
    const params = {email : email};
    const query = new URLSearchParams(params)
    const getAllUrl = url + `/api/task/all?${query}`
    
    const fetchAllTask = async () => {
      try {
        const res = await fetch(getAllUrl)
        if (res.ok) {
          const fetchData = await res.json()
          console.log('fetchData', fetchData)
          setUser(fetchData.user)
          // alert(JSON.stringify(fetchData))
        }
      } catch (error) {
        console.error({ error })
      } finally {
        console.log('done')
      }
    }
    fetchAllTask()
  }, [session])

  if (!session) {
    return (<div className={styles.main_loading}>
      <h1 className={styles.loading}>Now Loading.....</h1>
    </div>)
  }

  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="Task Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <br />
        <div className={styles.main}>
          <h1>タスク管理アプリ</h1>
          {user.id ?
            <>
              <div className={styles.profile_area}>
                {user.image &&
                  <div>
                    <Image className={styles.image} src={user.image} alt="" width={120} height={120} />
                  </div>
                }
                <div className={styles.name}>
                  {user.name && <p>名前：{user.name}</p>}
                </div>
                <div className={styles.btn_area}>
                  <button className={styles.previous_btn}>
                    <Link href={`/previous`}>過去のタスク</Link>
                  </button>
                  <button className={styles.logout_btn} onClick={() => signOut()}>ログアウト</button>
                </div>
              </div>
              <br />
              <hr />
              <br />
              <h2>現在のタスク一覧</h2>
              <br />
              {tasks.length > 0 ?
                <>
                  <div className={styles.tasks}>
                  {
                    tasks.map((task: TaskProps, index: number) => {
                      return (
                        <div className={styles.task} key={index}>
                          <div className={styles.task_title}>{task.title}</div>
                          <div className={styles.task_created}>{task.createdAt}</div>
                          <div className={styles.task_btn_area}>
                            <button className={styles.task_done_btn}>完了</button>
                            <button className={styles.task_delete_btn}>削除</button>
                          </div>
                        </div>
                      )
                    })
                  }
                  </div>
                </>
                :
                <div className={styles.main}>
                  <h1 className={styles.loading}>タスクはありません</h1>
                </div>
              }
            </>
            :
            <div className={styles.main_loading}>
              <h1 className={styles.loading}>Now Loading.....</h1>
            </div>
          }
        </div>
      </main>
    </>
  )
}
