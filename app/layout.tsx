import '@/app/ui/global.css'; //グローバルcssインポート
import { inter } from '@/app/ui/fonts'; //フォントをインポート
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    // %sは、各ページで設定しているタイトルに置き換えられる
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
  //「このアプリの絶対URLのベースはコレだよ！」ってNext.jsに教えてる記述
}


export default function RootLayout({
  children, //childrenプロップスを受け取る
}: {
  children: React.ReactNode; //型定義
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* ～.classNameでアプリ全体にフォントを適用させることができる */}
        {/* antialiasedは、Tailwind CSSのクラスで、フォントの見た目をなめらかにする */}
        {children}
      </body>
    </html>
  );
}
