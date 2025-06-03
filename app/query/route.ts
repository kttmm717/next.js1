//app/query/route.tsというファイル名がルーティングそのもの
//localhost:3000/queryにアクセスしたときにこのファイル内のものが実行される

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listInvoices() {
	const data = await sql`
    SELECT invoices.amount, customers.name --請求金額と顧客名前を取得
    FROM invoices --invoicesテーブルから
    JOIN customers ON invoices.customer_id = customers.id
    -- invoicesテーブルのcustomer_idとcustomersのidが一致する行を結び付ける
    WHERE invoices.amount = 666; --請求金額が666円のもの
  `;
	return data;
}

//localhost:queryにGETアクセスしたときに実行される処理
export async function GET() {
  try {
  	return Response.json(await listInvoices());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
