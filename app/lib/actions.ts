'use server';

// 色々なフォームのロジックを記述したファイル
// 請求書の作成フォーム、編集ォーム、削除ォーム、ログインフォーム

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';


export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

// PostgreSQLデータベースに接続するための記述
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
// .envからPOSTGRES_URLを読み込んでSSL接続強制でセキュアに接続

// フォームに入力されるデータの型定義＆バリデーションルールをZodで設定
const FormShema = z.object({

    id: z.string(),

    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
        //customerIdのエラーメッセージ
    }),

    amount: z.coerce.number()  // amountは数値型（文字列で来ても数値に変換）
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
        //amountのエラーメッセージ
    
    status: z.enum(['pending', 'paid'], {  // statusは'pending'または'paid'
        invalid_type_error: 'Please select an invoice status.',
        //statusのエラーメッセージ
    }),
    date: z.string(),
});

// フォームから受け取るデータにはidとdateが含まれていないのでそれを除外した新しいスキーマを作成（trueは「このキーを除くよ」という意味だけ）
const CreateInvoice = FormShema.omit({ id: true, date: true });

const UpdateInvoice = FormShema.omit({ id: true, date: true });


// ●●●請求書「作成」の関数●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
export async function createInvoice(prevState: State, formData: FormData) {

    // CreateInvoiceスキーマを使ってバリデーションチェック
    // .parse()はZodスキーマに「このデータをチェックして！」って命令するメソッド
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Database Error: Failed to Create Invoice.'
        }
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
                VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `
    } catch (error) {
        console.error(error);
        // 今のところエラーをコンソールに出力
    }

    // キャッシュを無効化して再生成する
    // / dashboard/invoicesのページを最新の情報にさせる
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// ●●●請求書「編集」の関数●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });


    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.'
        }
    }
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE
                invoices
            SET
                customer_id = ${customerId},
                amount = ${amountInCents},
                status = ${status}
            WHERE
                id = ${id}
        `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.'}
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// ●●●請求書「削除」の関数●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
export async function deleteInvoice(id: string) {
    await sql`
        DELETE FROM invoices
        WHERE id = ${id};
        
    `
    revalidatePath('/dashboard/invoices');
    // 今回違うページに行ってるワケではないのでリダイレクトは無し
}

// ●●●ログインフォームロジック関数●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
export async function loginUser(
    // 引数
    prevState: string | undefined,
    formData: FormData, //ログインフォームから送られた情報が入っている
) {
    try {
        await signIn('credentials', formData);
        // NextAuthのcredentialsプロバイダを使って、formDataでログインを試みる！

    } catch (error) {
        if (error instanceof AuthError) {
        // エラーの内容がAuthErrorだったら
            switch (error.type) {
                case 'CredentialsSignin':
                // error.typeがCredentialsSigninのとき
                    return 'Invalid credentials.';
                    // ログイン情報が間違ってるよと表示
                default:
                    return 'Something went wrong.';
                    // ログイン情報以外のエラーだったら汎用的なメッセージを返す
            }
        }
        throw error;
        // AuthError以外の謎のエラーだったらスルー
    }
}