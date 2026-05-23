'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Create Article',
      icon: '📝',
    },
    {
      href: '/articles',
      label: 'Manage Articles',
      icon: '📚',
    },
    {
      href: '/convert',
      label: 'Convert Articles',
      icon: '🔄',
    },
  ];

  return (
    <aside className="w-64 bg-gray-800 dark:bg-gray-900 text-white min-h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-8">Article Creator</h1>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

