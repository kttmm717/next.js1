'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';


export default function Search({ placeholder }: { placeholder: string }) {

  const serchParams = useSearchParams();
  // URLのクエリパラメータの取得、クエリパラメータの監視（リアクティブに変化を検知）ができるようになる
  const pathname = usePathname();
  const { replace } = useRouter();

  // onChange関数
  const handleSearch = useDebouncedCallback((e: string) => {
    // useDebouncedCallbackでラップすると、ユーザーが入力を停止してから特定の時間(300ミリ秒)が経過した後にコードを実行する

    const params = new URLSearchParams(serchParams);
    // URLSearchParamsは、URLクエリパラメータを操作するための便利なメソッドを提供するWebAPI

    params.set('page', '1');

    if (e) {
      params.set('query', e);  //query=入力文字列としてURLを更新
    } else {
      params.delete('query');  //queryパラメータをURLから削除
    }
    replace(`${pathname}?${params.toString()}`);
    // useRouterフックを使って新しいURLを作成
    // 例　/dashboard/invoices?query=lee
  }, 300);

  // ここからビュー
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      {/* 検索ボックス */}
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={serchParams.get('query')?.toString()}
        // ?.toString()→オプショナルチェーン演算子
        // queryがtrue→.toString()実行
        // queryがnull→undefinedを返してエラーにならずスルー
      />

      {/* 虫眼鏡アイコン */}
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
