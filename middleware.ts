import NextAuth from "next-auth";
import { authConfig } from "./auth.config";


// NextAuth.jsを初期化してエクスポート
export default NextAuth(authConfig).auth;
// .authを付けることでauthConfig関数はリクエストが来るたびに毎回実行されるミドルウェアですよ～ってNext.jsに教えている


// ミドルウェアの設定オブジェクト(どのページでミドルウェアを使うか指定)
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
    // APIルート除外
    // Next.jsの内部ファイルや画像配信系は除外
    //.pngファイルへのリクエストは除外（画像とか）
};