import { Inter, Lusitana } from 'next/font/google';
//Next.jsが提供する組み込みのGoogleFontsローダーから、GoogleFontsのInterというフォントをインポート

export const inter = Inter({ subsets: ['latin'] });
//Interフォントの中から、latin(英語に使う部分)だけを定数に格納
//フォントは全言語分だとファイルが大きくなるので必要な文字セット(サブセット)だけ読み込んで軽量＆高速にする

export const lusitana = Lusitana({
    subsets: ['latin'],
    weight: ['400', '700'],
});