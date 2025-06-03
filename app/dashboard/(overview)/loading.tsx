// Next.jsではディレクトリに loading.tsx を置くだけで、ページが読み込まれるまでの間このファイルの内容が表示される

import DashboardSkeleton from "../../ui/skeletons";

export default function Loading() {
    return <DashboardSkeleton />
}