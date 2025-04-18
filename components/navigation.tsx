'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMedia } from 'react-use';

import { NavButton } from '@/components/nav-button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from './ui/button';
import { MenuIcon } from 'lucide-react';

const routes = [
	{
		href: '/',
		label: 'Overview',
	},
	{
		href: '/transactions',
		label: 'Transactions',
	},
	{
		href: '/accounts',
		label: 'Accounts',
	},
	{
		href: '/categories',
		label: 'Categories',
	},
	{
		href: '/settings',
		label: 'Settings',
	},
];
export const Navigation = () => {
	const router = useRouter();
	const pathName = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const isMobile = useMedia('(max-width:1024px)', false);

	const onClick = (href: string) => {
		router.push(href);
		setIsOpen(false);
	};

	if (isMobile) {
		return (
			<Sheet
				open={isOpen}
				onOpenChange={setIsOpen}>
				<SheetTitle></SheetTitle>

				<SheetTrigger asChild>
					<Button
						variant='outline'
						size='sm'
						className='font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition'>
						<MenuIcon className='size-4' />
					</Button>
				</SheetTrigger>
				<SheetContent
					side='left'
					className='px-2'>
					<nav className='flex flex-col gap-y-2 pt-6'>
						{routes.map(route => (
							<Button
								key={route.href}
								variant={pathName === route.href ? 'secondary' : 'ghost'}
								onClick={() => onClick(route.href)}
								className='font-medium w-full justify-start'>
								{route.label}
							</Button>
						))}
					</nav>
				</SheetContent>
			</Sheet>
		);
	}
	return (
		<nav className='hidden lg:flex items-center gap-2 overflow-x-auto'>
			{routes.map(route => (
				<NavButton
					key={route.href}
					href={route.href}
					label={route.label}
					isActive={pathName === route.href}
				/>
			))}
		</nav>
	);
};
