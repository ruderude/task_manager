import { getSession } from 'next-auth/react';

export default function about({ user }: { user: any }) {
  if (user) {
    return <h1>{user.name}</h1>;
  }
  return <h1>No Page</h1>;
}

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  if (!session) {
    return {
      props: {},
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}