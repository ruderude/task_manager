import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const { data: session } = useSession({ required: true })

  useEffect(() => {
    console.log('useEffect')
    console.log('session', session)
    const email = session?.user?.email ?? ''
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
          console.log(fetchData)
        }
      } catch (error) {
        console.error({ error })
      } finally {
        console.log('done')
      }
    }
    fetchAllTask()
  }, [])

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
          {/* <h2>ようこそ, {name}</h2>
          <div>{email}</div>
          <div>{image}</div>
          {
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
