// auth.config.tsの役割：NextAuthの動作をどうするか決める「設定ファイル」 
//「ログイン画面どこ？」「ログイン中の人にどこまで見せる？」などを決める


import type { NextAuthConfig } from 'next-auth';

// authConfigは、NextAuthの設定オブジェクト
export const authConfig = {
    // ログイン画面のURLを指定
    pages: {
        signIn: '/login',
        // もしログインしていないユーザーが/dashboardにアクセスしようとすると、ここに指定したパスに飛ばされるようになる
    },

    // 特定のページにアクセスできる条件を定義
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            // authorizedは、特定のページにアクセスできるかどうかをチェックする関数

            const isLoginIn = !!auth?.user;
            // まず、ユーザーがログインしているかをチェック

            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            // アクセスしようとしてるURLが、/dashboardから始まっているかをチェック

            if (isOnDashboard) { //もし/dashboardにアクセスしようとしてるなら
                if (isLoginIn) return true; //ログインしてるならOK
                return false; // してないならNG(ログインページにリダイレクト)
                
            } else if (isLoginIn) {
            //もし/dashboard以外にアクセスしようとしててログインもしている状態なら
                
                return Response.redirect(new URL('/dashboard', nextUrl));
                // /dashboard にリダイレクト
            }
            return true; // それ以外のパターンはアクセス許可
        }
    },
    providers: [],
    //「どんな方法でログインするか」（例: Google, GitHub, Email）

} satisfies NextAuthConfig;
// satisfiesがあることで、書いたプロパティがNextAuthConfigにちゃんと合ってるかチェックされる