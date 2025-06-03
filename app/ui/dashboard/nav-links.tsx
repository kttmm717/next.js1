// 今は小規模アプリなのでリンクコードを直書きしているが大規模アプリになったらテーブルに管理するのが良い

'use client';
//Reactのフックを使う時はクライアントコンポーネントと明示するために記述する

import {
	UserGroupIcon,
	HomeIcon,
	DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
	{
		name: 'Home',
		href: '/dashboard',
		icon: HomeIcon
	},
	{
		name: 'Invoices',
		href: '/dashboard/invoices',
		icon: DocumentDuplicateIcon,
	},
	{
		name: 'Customers',
		href: '/dashboard/customers',
		icon: UserGroupIcon
	},
];

export default function NavLinks() {

	const pathname = usePathname();
	//現在のURLパスを取得するためのフック使用

	return (
		<>
			{links.map((link) => {
				const LinkIcon = link.icon;
				return (
					<Link
						key={link.name}
						href={link.href}
						className={clsx(
							'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 hover:bg-sky-100 hover:text-blue-600',
							{ 'bg-sky-100 text-blue-600': pathname === link.href }
						)}
					>
						{/* リンクのアイコン */}
						<LinkIcon className="w-6" />
						{/* リンク文字 */}
						<p className="hidden md:block">{link.name}</p>
					</Link>
				);
			})}
		</>
	);
}
