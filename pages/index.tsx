import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // コンポーネントがマウントされた後の処理
    console.log('Component mounted');

    // コンポーネントがアンマウントされる前の処理
    return () => {
      console.log('Component unmounted');
    };
  }, []); // 第二引数に空の依存配列を指定することで、マウント時にのみ実行されます

  return <h1>Hello, Next.js!</h1>;
}

export default MyComponent;