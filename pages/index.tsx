import { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession({ required: true })
  const name = session?.user?.name ?? 'ななしさん'
  const mail = session?.user?.email ?? 'メールアドレスなし'
  const image = session?.user?.image as string ?? 'https://placehold.jp/150x150.png'

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
              <h2>ようこそ, {name}</h2>
              <div>{mail}</div>
              {
                <div>
                  <Image src={image} alt="" width={96} height={96} />
                </div>
              }
              <div>
                <Link href={`/previous`}>過去のタスク</Link>
              </div>
              <button onClick={() => signOut()}>Sign out</button>
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
