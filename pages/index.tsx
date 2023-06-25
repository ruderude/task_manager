import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const getUser = async () => {
  const user = await prisma.user.findMany()
  return user
}

export default async function Home() {
  const { data: session } = useSession({ required: true })
  const user = await getUser()
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await fetch('/api/user'); // ユーザーデータを取得するAPIエンドポイントのパス
  //     const data = await response.json();
  //     setUser(data);
  //   }

  //   fetchData();
  // }, []);

  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="Task Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {
          session && (
            <div>
              <h1 className={styles.title}>Task Manager!!</h1>
              <h2>ようこそ, {session.user && session.user.email}</h2>
              <div>{session.user?.email}</div>
              {session.user?.image && (
                <div>
                  <Image src={session.user?.image} alt="" width={96} height={96} />
                </div>
              )}
              <div>
                <Link href={`/previous`}>過去のタスク</Link>
              </div>
              <button onClick={() => signOut()}>Sign out</button>
              <br />
              { user &&
                user.map((user) => (
                  <div key={user.id}>
                    <div>{user.name}</div>
                    <div>{user.email}</div>
                  </div>
                ))
              }
            </div>
          )
        }
        {
          !session && (
            <>
              {/* <div>
                <p>ログインが必要です</p>
              </div>
              <div>
                <button onClick={() => signIn()}>ログイン</button>
              </div> */}
            </>
          )
        }
      </main>
    </>
  )
}
