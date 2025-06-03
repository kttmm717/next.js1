'use server';

// 請求書の作成、編集、削除のファイル

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


// PostgreSQLデータベースに接続するための記述
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
// .envからPOSTGRES_URLを読み込んでSSL接続強制でセキュアに接続

// フォームに入力されるデータの型定義＆バリデーションルールをZodで設定
const FormShema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),  // amountは数値型（文字列で来ても数値に変換）
    status: z.enum(['pending', 'paid']),  // statusは'pending'または'paid'
    date: z.string(),
});

// フォームから受け取るデータにはidとdateが含まれていないのでそれを除外した新しいスキーマを作成（trueは「このキーを除くよ」という意味だけ）
const CreateInvoice = FormShema.omit({ id: true, date: true });

const UpdateInvoice = FormShema.omit({ id: true, date: true });


// 請求書作成の関数
export async function createInvoice(formData: FormData) {

    // CreateInvoiceスキーマを使ってバリデーションチェック
    // .parse()はZodスキーマに「このデータをチェックして！」って命令するメソッド
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `
    // キャッシュを無効化して再生成する
    // / dashboard/invoicesのページを最新の情報にさせる
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// 請求書編集の関数
export async function updateInvoice(id: string, formData: FormData) {

    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;

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

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// 請求書削除の関数
export async function deleteInvoice(id: string) {
    await sql`
        DELETE FROM invoices
        WHERE id = ${id};
    `
    revalidatePath('/dashboard/invoices');
    // 今回違うページに行ってるワケではないのでリダイレクトは無し
}