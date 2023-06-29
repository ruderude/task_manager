import { ReactNode } from 'react';
import { signIn, useSession } from 'next-auth/react';

type Props = {
  children?: ReactNode
}

const ProtectedPage = ({children}: Props) => {
  const { data: session, status: loading } = useSession()
  if(loading) return null

  if(!loading && !session) {
    return <button  onClick={() => signIn()}>ログイン</button>
  }
  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedPage