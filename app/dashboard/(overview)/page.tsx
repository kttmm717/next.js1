import { lusitana } from "../../ui/fonts";
import RevenueChart from "../../ui/dashboard/revenue-chart";
import LatestInvoices from "../../ui/dashboard/latest-invoices";
import CardWrapper from '@/app/ui/dashboard/cards';
import { Suspense } from "react";
// <Suspense fallback={...}> を使うことで、読み込みが遅いコンポーネントを待たずに他の速いコンポーネントからすぐに表示できる
import {
    LatestInvoicesSkeleton,
    RevenueChartSkeleton,
    CardsSkeleton
} from "@/app/ui/skeletons";

export default async function Page() {
    return (
        <main>
            <h1 className={`${lusitana} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 
            md:grid-cols-4 lg:grid-cols-8">
                {/* 収益チャートコンポーネント */}
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>

                {/* 最新5件の請求書コンポーネント */}
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}
// コンポーネントに渡しているプロップスは、data.tsのsql文で取得している配列のデータに基づいて、各コンポーネントで処理されている