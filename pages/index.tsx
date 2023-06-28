import { useSession, signIn, signOut } from 'next-auth/react'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const { data: session } = useSession({ required: true })

  if (!session) {
    return <h1>No Page</h1>
  }

  const name = session.user?.name ?? 'ななしさん'
  const email = session.user?.email ?? 'ななし@ななし.com'
  const image = session.user?.image as string ?? 'https://placehold.jp/150x150.png'

  
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
          <h2>ようこそ, {name}</h2>
          <div>{email}</div>
          <div>{image}</div>
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
      </main>
    </>
  )
}
