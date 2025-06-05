// すべてのエラーを処理するerror.tsx
// error.tsx は、特定のエラーじゃなくて全体の予期しないエラーをキャッチするための「最後の砦」みたいなファイル

'use client'; //error.tsxはクライアントコンポーネントである必要がある
import { useEffect } from "react";


type Props = {
    error: Error & { digest?: string };
    // Error型をベースにしつつ、digest?: stringという追加プロパティも持つ型
    reset: () => void;
}

export default function Error({ error, reset }: Props) {
    // error:どんなエラーが起きたかの情報を含むErrorオブジェクト
    // reset:エラーをリセットして、もう一度そのルートを再表示するための関数
    // error と reset は error.tsx ファイル内限定で使える特別なprops!!
    
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h2>Something went wrong!</h2>
            <button
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400"
                onClick={() => reset()}>
                Try again
            </button>
        </main>
    )
}