import { lusitana } from "@/app/ui/fonts";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import Table from '@/app/ui/invoices/table';
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { fetchInvoicesPages } from "@/app/lib/data";
import Pagination from "@/app/ui/invoices/pagination";

// ネスト構造で型定義
type Props = {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>
}

export default async function Page(props: Props) {

    // これらのプロップスはURLのクエリパラメータからsearchParamsが自動で渡してくれている
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    // queryがもしfalseなら空文字返却
    const currentPage = Number(searchParams?.page) || 1;
    // searchParamsがもしfalseなら1返却

    const totalPages = await fetchInvoicesPages(query);
    // queryをfetchInvoicesPagesのsql文にかけてその結果を格納

    return (
        <div className="w-full">
            {/* ページのタイトル */}
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>
                    Invoices
                </h1>
            </div>

            {/* 検索欄＆請求書作成ボタン */}
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search invoices..." />
                <CreateInvoice />
            </div>

            {/* 請求一覧テーブル */}
            <Suspense
                key={query + currentPage}
                fallback={<InvoicesTableSkeleton />}
            >
                <Table query={query} currentPage={currentPage} />
            </Suspense>

            {/* ページネーション */}
            <div>
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}