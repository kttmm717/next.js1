//app/seed/route.tsというファイル名がルーティングそのもの
//localhost:3000/seedにアクセスしたときにこのファイル内のものが実行される

import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// usersテーブル作成、挿入関数
async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  // UUID生成に必要な拡張機能を有効化（PostgreSQL用）
  await sql`
    -- usersテーブル作成
    CREATE TABLE IF NOT EXISTS users (
      id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
      --UUIDを使った主キーを自動生成
      name varchar(255) NOT NULL, --名前は255文字まで、NULL不可
      email text NOT NULL UNIQUE, --メールアドレスは一意でNULL不可
      password TEXT NOT NULL --パスワードはtext型でnull不可
    );
    
  `;
  // placeholder-dataのusers配列からmap関数で挿入
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      // パスワードをbcryptでハッシュ化して定数に格納
      return sql`
        INSERT INTO users (id, name, email, password)
        -- usersの4つのカラムに
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}) -- mapで回している値を挿入
        ON CONFLICT (id) DO NOTHING; -- idが重複していたら挿入しない
      `;
    }),
  );

  return insertedUsers;
}

//invoicesテーブル作成、挿入関数
async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

//customersテーブル作成、挿入関数
async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

//revenueテーブル作成、挿入関数
async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

//localhost:seedにGETアクセスしたときに実行される処理
export async function GET() {
  try {
    await sql.begin(() => [
      seedUsers(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
