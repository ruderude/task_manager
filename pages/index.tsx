import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import styles from '@/styles/Home.module.css'
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
  createdAt: string
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
    const getUser = url + `/api/user?${query}`
    // const getAllUrl = url + `/api/task/all?${query}`
    
    const fetchAllTask = async () => {
      try {
        const res = await fetch(getUser)
        if (res.ok) {
          const fetchData = await res.json()
          console.log('fetchData', fetchData)
          setUser(fetchData)
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
    return <h1>Now Loading.....</h1>
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
        <div>
          <h1>Topページ</h1>
          {
            user.id ?
              <>
                <h2>ようこそ, {user.name}</h2>
                <div>{user.email}</div>
                <div>{user.image}</div>
              </>
              :
              <>
                <h1>Now User Loading.....</h1>
              </>
          }
          {/* <h2>ようこそ, {user.name}</h2>
          <div>{user.email}</div>
          <div>{user.image}</div> */}
          {/* {
            <div>
              <Image src={image} alt="" width={96} height={96} />
            </div>
          } */}
          <div>
            <Link href={`/previous`}>過去のタスク</Link>
          </div>
          <button onClick={() => signOut()}>Sign out</button>
          {/* {allTask ?
            allTask.map((task: any) => {
              return (
                <div key={task.id}>
                  <div>{task.title}</div>
                </div>
              )
            })
            :
            <div>タスクがありません</div>
          } */}
        </div>
      </main>
    </>
  )
}
