'use client'

import { useState, Fragment } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useSession } from 'next-auth/react'

// === NEW NAVIGATION STRUCTURE ===
const navigation = [
  {
    name: 'Tools',
    children: [
      { name: 'All Tools', href: '/tools' },
      { name: 'Price Comparison', href: '/tools/comparison' },
      {
        name: 'By Category',
        children: [
          { name: 'Channel Manager', href: '/tools/channel-manager' },
          { name: 'Automation', href: '/tools/automation' },
          { name: 'Pricing', href: '/tools/pricing' },
          { name: 'Communication', href: '/tools/communication' },
          { name: 'Cleaning', href: '/tools/cleaning' },
        ],
      },
    ],
  },
  {
    name: 'Resources',
    children: [
      { name: 'Templates & Merch', href: '/templates' },
      { name: 'Checklists', href: '/checklists' },
      { name: 'Guides', href: '/guides' },
      { name: 'Masterclass', href: '/masterclass' },
      { name: 'Webinars', href: '/webinars' },
      { name: 'Printable Resources', href: '/resources/printable' },
      { name: 'Testimonials', href: '/testimonials' },
    ],
  },
  { name: 'Industry News', href: '/news' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  {
    name: 'Connect',
    children: [
      { name: 'Airbnb Ambassador', href: '/connect/ambassador' },
      { name: 'Book a Consultation', href: '/connect/consultation' },
      { name: 'Join a Webinar', href: '/webinar' },
      { name: 'YouTube / Podcast / Socials', href: '/socials' },
    ],
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { state } = useCart()
  const { data: session, status } = useSession()

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <img
              src="/logo-2.svg"
              alt="STR Specialist"
              className="h-8 w-auto"
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <div className="flex lg:hidden items-center gap-4">
          {/* Mobile Cart Icon */}
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
            <ShoppingCartIcon className="h-6 w-6" />
            {state.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {state.itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="p-2 rounded-md text-gray-600"
            onClick={() => setMobileOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) =>
            item.children ? (
              <Menu as="div" className="relative" key={item.name}>
                <Menu.Button className="flex items-center gap-x-1 text-base font-semibold text-gray-900 hover:text-indigo-600">
                  {item.name}
                  <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                </Menu.Button>
                <Transition as={Fragment}>
                  <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      {item.children.map((child) =>
                        "children" in child && child.children ? (
                          <div key={child.name} className="border-b border-gray-100 px-4 py-2">
                            <span className="font-semibold text-gray-700">{child.name}</span>
                            <div className="ml-2 mt-1 flex flex-col gap-1">
                              {child.children.map((sub) => (
                                <Menu.Item key={sub.name}>
                                  {({ active }) => (
                                    <Link
                                      href={sub.href as string}
                                      className={classNames(
                                        active ? 'bg-gray-100 text-indigo-700' : 'text-gray-700',
                                        'block px-2 py-1 rounded'
                                      )}
                                    >
                                      {sub.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </div>
                          </div>
                        ) : (
                          "href" in child && typeof child.href === 'string' ? (
                            <Menu.Item key={child.name}>
                              {({ active }) => (
                                <Link
                                  href={child.href as string}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-indigo-700' : 'text-gray-700',
                                    'block px-4 py-2 rounded'
                                  )}
                                >
                                  {child.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ) : null
                        )
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              "href" in item && typeof item.href === 'string' ? (
                <Link
                  key={item.name}
                  href={item.href as string}
                  className="text-base font-semibold text-gray-900 hover:text-indigo-600"
                >
                  {item.name}
                </Link>
              ) : null
            )
          )}
        </div>

        {/* Right side - Cart and User */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
            <ShoppingCartIcon className="h-6 w-6" />
            {state.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {state.itemCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {status === 'loading' ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          ) : session?.user ? (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={session.user.image || '/default-avatar.png'}
                  alt={session.user.name || 'User'}
                />
                <span className="hidden md:block text-gray-700 font-medium">
                  {session.user.name}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </Menu.Button>
              <Transition as={Fragment}>
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Profile & Orders
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            import('next-auth/react').then(({ signOut }) => 
                              signOut({ callbackUrl: '/' })
                            )
                          }}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link
              href="/login"
              className="text-base font-bold text-gray-900 hover:text-indigo-600 px-4 py-2 rounded transition"
            >
              Log in &rarr;
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Transition.Root show={mobileOpen} as={Fragment}>
        <Dialog as="div" className="lg:hidden" onClose={setMobileOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 z-50" />
          </Transition.Child>

          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/" className="flex items-center">
                <img
                  src="/logo-2.svg"
                  alt="STR Specialist"
                  className="h-8 w-auto"
                  style={{ objectFit: 'contain' }}
                />
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 flex flex-col gap-2">
              {navigation.map((item) =>
                item.children ? (
                  <Disclosure key={item.name}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between items-center px-2 py-2 text-base font-semibold text-gray-900 hover:bg-gray-100 rounded">
                          {item.name}
                          {item.children && <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />}
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <div className="pl-4 flex flex-col gap-2">
                            {item.children.map((child) =>
                              "children" in child && child.children ? (
                                <div key={child.name}>
                                  <span className="font-semibold">{child.name}</span>
                                  <div className="ml-2 mt-1 flex flex-col gap-1">
                                    {child.children.map((sub) => (
                                      <Link key={sub.name} href={sub.href as string} className="block text-gray-600 py-1">
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                "href" in child && typeof child.href === 'string' ? (
                                  <Link key={child.name} href={child.href as string} className="block text-gray-600 py-1">
                                    {child.name}
                                  </Link>
                                ) : null
                              )
                            )}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ) : (
                  "href" in item && typeof item.href === 'string' ? (
                    <Link key={item.name} href={item.href as string} className="block px-2 py-2 text-base font-semibold text-gray-900 hover:bg-gray-100 rounded">
                      {item.name}
                    </Link>
                  ) : null
                )
              )}
              
              {/* Mobile User Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                {session?.user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={session.user.image || '/default-avatar.png'}
                        alt={session.user.name || 'User'}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      className="block w-full text-center bg-indigo-600 text-white py-2 rounded-md font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      Profile & Orders
                    </Link>
                    <button
                      onClick={() => {
                        import('next-auth/react').then(({ signOut }) => 
                          signOut({ callbackUrl: '/' })
                        )
                      }}
                      className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-md font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full text-center bg-indigo-600 text-white py-2 rounded-md font-bold"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in →
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </Dialog>
      </Transition.Root>
    </header>
  )
}
