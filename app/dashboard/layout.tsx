import { ReactNode } from "react";
import SideNav from "../ui/dashboard/sidenav";

// ppr宣言
export const experimental_ppr = true;
// 明示的に「ここはプリレンダして！」と Next.jsに伝えるため。特にSEOや表示スピード最適化に強力

type Props = {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            {/* 左側のナビサイド */}
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>

            {/* 右側のメインサイド */}
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                {children}
                {/* このchildrenには同じ階層&子階層にあるpage.tsxの内容が入ってくる */}
            </div>
        </div>
    );
}