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
  id: string
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
  const [isDisabled, setDisabled] = useState<boolean>(false)
  const url = process.env.NEXT_PUBLIC_BASE_URL
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

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

  const setDateString = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  const fetchAllTask = async (email: string) => {
    const params = {email : email};
    const query = new URLSearchParams(params)
    const getAllUrl = `${url}/api/task/all?${query}`
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
      alert('エラーです。')
      alert(JSON.stringify(error))
      console.error({ error })
    } finally {
      console.log('done')
    }
  }

  const createTask: SubmitHandler<Inputs> = async (data) => {
    // alert(JSON.stringify(data))
    if (!user.id) {
      alert('ユーザー情報が取得できませんでした。')
      return
    }
    setDisabled(true)
    const params = {userId : user.id, task : data.task};
    const postTaskUrl = `${url}/api/task`
    try {
      const res = await fetch(postTaskUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })

      if (res.ok) {
        // alert('タスクを追加しました。')
        // alert(JSON.stringify(res))
        clearForm()
        setTasks([])
        const email = user.email as string
        fetchAllTask(email)
        return
      }
      alert('タスクの追加に失敗しました。')
    } catch (error) {
      alert('タスクの追加に失敗しました。')
      console.error({ error })
    } finally {
      console.log('done')
      setDisabled(false)
    }
  }

  const updateTask = async (id: number, done: boolean) => {
    if (!user.id) {
      alert('ユーザー情報が取得できませんでした。')
      return
    }
    setDisabled(true)
    const params = {taskId : id, done : !done};
    const updateTaskUrl = `${url}/api/task`
    try {
      const res = await fetch(updateTaskUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })

      if (res.ok) {
        // alert('タスクを更新しました。')
        // alert(JSON.stringify(res))
        clearForm()
        setTasks([])
        const email = user.email as string
        fetchAllTask(email)
        return
      }
      alert('タスクの更新に失敗しました。')
    } catch (error) {
      alert('タスクの更新に失敗しました。')
      console.error({ error })
    } finally {
      console.log('done')
      setDisabled(false)
    }
  }

  useEffect(() => {
    // console.log('session', session)
    // alert(JSON.stringify(session))
    if(!session) return
    const email = session?.user?.email ?? ''
    // const email = 'rude1979@gmail.com'
    fetchAllTask(email)
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
                <form onSubmit={handleSubmit(createTask)}>
                  <div>
                    <label htmlFor="task">新規タスク追加</label>
                  </div>
                  <div className={styles.new_task}>
                    <div>
                      <input
                        className={styles.task_input}
                        id="task"
                        type="text"
                        {...register('task', {
                          required: {
                            value: true,
                            message: 'タスクの入力は必須です。',
                          },
                          maxLength: {
                            value: 250,
                            message: '250文字以下で入力してください。',
                          },
                        })}
                      />
                    </div>
                    <div>
                      <button className={styles.submit_btn} type="submit" disabled={isDisabled}>追加</button>
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
                    tasks.map((task: TaskProps) => {
                      return (
                        <div key={task.id}>
                          <div className={`${task.done ? styles.done : ""} ${styles.task_title}`}>{task.title}</div>
                          <div className={styles.task_under}>
                            <div className={styles.task_created}>{setDateString(task.createdAt)}</div>
                            <div className={styles.task_btn_area}>
                              {
                                task.done ?
                                  <button className={styles.task_undone_btn} onClick={() => updateTask(Number(task.id), task.done)} disabled={isDisabled}>未完了</button>
                                  :
                                  <button className={styles.task_done_btn} onClick={() => updateTask(Number(task.id), task.done)} disabled={isDisabled}>完了</button>
                              }
                              
                              <button className={styles.task_delete_btn}>削除</button>
                            </div>
                          </div>
                          <hr className={styles.task_under_line} />
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
