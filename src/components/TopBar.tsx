'use client'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import logout from '@/firebase/auth/logout'
import { useState } from 'react'

export function TopBar() {
  const { user } = useAuthContext() as { user: any }
  const router = useRouter()
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleLogout = async () => {
    const { error } = await logout()
    if (error) {
      console.error('Logout error:', error)
      return
    }
    router.push('/')
  }

  const navItems = [
    { 
      name: 'Landing', 
      path: '/', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      show: true 
    },
    { 
      name: 'Dashboard', 
      path: '/home', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      show: !!user 
    },
    { 
      name: 'Survey', 
      path: '/survey', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      show: !!user 
    },
    { 
      name: 'Matches', 
      path: '/match', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      show: !!user 
    },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => 
              item.show ? (
                <div key={item.path} className="relative">
                  <button
                    onClick={() => router.push(item.path)}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-emerald-500 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span className="hidden md:inline text-sm font-medium">
                      {item.name}
                    </span>
                  </button>
                  
                  {/* Tooltip for mobile */}
                  {hoveredItem === item.name && (
                    <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </div>
              ) : null
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <div className="relative">
              <div
                onMouseEnter={() => setHoveredItem('Theme')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <ThemeToggle />
              </div>
              {hoveredItem === 'Theme' && (
                <div className="md:hidden absolute top-full right-0 mt-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap">
                  Toggle Theme
                </div>
              )}
            </div>

            {/* Logout Button */}
            {user && (
              <div className="relative">
                <button
                  onClick={handleLogout}
                  onMouseEnter={() => setHoveredItem('Logout')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden md:inline text-sm font-medium">
                    Logout
                  </span>
                </button>
                {hoveredItem === 'Logout' && (
                  <div className="md:hidden absolute top-full right-0 mt-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap">
                    Logout
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}