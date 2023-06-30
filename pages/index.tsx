import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import styles from '@/styles/Home.module.scss'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface Inputs {
  task: string
}

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
  const [tasks, setTasks] = useState<TaskProps[]>([])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const sendForm: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }

  const clearForm = () => {
    const task = document.getElementById('task') as HTMLInputElement
    task.value = ''
  }

  const loadingNode = () => {
    return (
      <div className={styles.main_loading}>
        <h1 className={styles.loading}>Now Loading.....</h1>
      </div>
    )
  }

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
          setTasks(fetchData.tasks)
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
    loadingNode()
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
              <div>
                <form onSubmit={handleSubmit(sendForm)}>
                  <div className={styles.new_task}>
                    <div>
                      <label htmlFor="task">Email</label>
                      <input
                        id="task"
                        type="text"
                        {...register('task', {
                          required: {
                            value: true,
                            message: 'タスクの入力は必須です。',
                          },
                          maxLength: {
                            value: 8,
                            message: '8文字以下で入力してください。',
                          },
                        })}
                      />
                    </div>
                    <div>
                      <button type="submit">追加</button>
                    </div>
                  </div>
                  {errors.task?.type === 'required' && (
                    <div className={styles.error}>{ errors.task?.message }</div>
                  )}
                  {errors.task?.type === 'maxLength' && (
                    <div className={styles.error}>{ errors.task?.message }</div>
                  )}
                </form>
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
            loadingNode()
          }
        </div>
      </main>
    </>
  )
}
