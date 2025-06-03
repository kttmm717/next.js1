import '@/app/ui/global.css'; //グローバルcssインポート
import { inter } from '@/app/ui/fonts'; //フォントをインポート

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
