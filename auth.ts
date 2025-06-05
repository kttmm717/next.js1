// auth.tsの役割：認証処理を行う設定ファイル
//「メールアドレス&パスワードでログインする仕組みを実装してる

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
// 入力されたemailやpasswordが正しい型かチェックするのに使う
import bcryt from 'bcrypt';
import type { User } from "./app/lib/definitions";
import postgres from "postgres";
// PostgreSQLに接続するためのライブラリ


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
// .envにあるPOSTGRES_URLを使って、DBに接続！
// ssl:'require'は、本番環境でのSSL通信を保証する設定

// 入力されたメールアドレスから、該当ユーザーを探す関数
async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User[]>`
            SELECT
                *
            FROM
                users
            WHERE
                email = ${email}
        `;
        return user[0];
        // user[0]として最初の1件を返す

    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

// 認証に必要なもの（auth、signIn、signOut）をエクスポート
// これで他のファイルからこの3つが使えるようになる
export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    // auth.config.ts の設定をマージ

    // 使用するログイン方法（プロバイダ）を指定。今回はメール&パスワード
    providers:
        [Credentials({
            async authorize(credentials) {
            // ユーザーがログインフォームを送信したときに呼ばれる関数

                // まず、zodを使ってemailとpasswordの形式チェック！
                const loginInput = z.object({
                    email: z.string().email(), //emaiはstring型でメールアドレス形式か？
                    password: z.string().min(6) //パスワードは6文字以上か？
                }).safeParse(credentials);
                // 最後に.safeParse(credentials)を付けることでオブジェクトが返ってくる

                // もし成功すれば以下のようなオブジェクトが返ってくる
                // {
                //     success: true,
                //         data: {
                //             email: "example@example.com",
                //             password: "123456"
                //         }
                //  }
                
                if (loginInput.success) {
                    const { email, password } = loginInput.data;

                    const user = await getUser(email);
                    // getUser関数呼び出して、メールアドレスでユーザーを検証
                    if (!user) return null;
                    // 検証できなかったらnullを返してログイン失敗！

                    const passwordMatch = await bcryt.compare(password, user.password);
                    if (passwordMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        })],
});