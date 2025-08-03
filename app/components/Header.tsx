'use client'

import { useState, Fragment } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

// === NEW NAVIGATION STRUCTURE ===
const navigation = [
  // ... (your navigation array, unchanged)
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { state } = useCart()

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
                                      href={sub.href}
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
                                  href={child.href}
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
                  href={item.href}
                  className="text-base font-semibold text-gray-900 hover:text-indigo-600"
                >
                  {item.name}
                </Link>
              ) : null
            )
          )}
        </div>

        {/* Right side - Cart */}
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
          {/* No login/profile UI */}
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
                                      <Link key={sub.name} href={sub.href} className="block text-gray-600 py-1">
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                "href" in child && typeof child.href === 'string' ? (
                                  <Link key={child.name} href={child.href} className="block text-gray-600 py-1">
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
                    <Link key={item.name} href={item.href} className="block px-2 py-2 text-base font-semibold text-gray-900 hover:bg-gray-100 rounded">
                      {item.name}
                    </Link>
                  ) : null
                )
              )}
              {/* No mobile user section, just navigation */}
            </nav>
          </div>
        </Dialog>
      </Transition.Root>
    </header>
  )
}
