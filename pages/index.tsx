import { getSession } from 'next-auth/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  user: {
    name: string
    email: string
    image: string
  }
}

export default function Home({ user }: Props) {
  if (!user) {
    return <h1>No Page</h1>
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
          <h2>ようこそ, {user.name}</h2>
          <div>{user.email}</div>
          <div>{user.image}</div>
          {
            <div>
              <Image src={user.image} alt="" width={96} height={96} />
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

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  const { user } = session
  return {
    props: { user },
  }
}