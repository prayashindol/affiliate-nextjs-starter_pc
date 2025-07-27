'use client'

import { useState, Fragment } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

// --- NAVIGATION STRUCTURE --- //
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
          // Add more categories as needed
        ],
      },
    ],
  },
  {
    name: 'Templates & Merch',
    children: [
      { name: 'All Templates', href: '/templates' },
      { name: 'Shop Merchandise', href: '/merch' },
    ],
  },
  {
    name: 'Masterclass',
    children: [
      { name: 'Course Details', href: '/masterclass' },
      { name: 'Weekly Webinar', href: '/webinar' },
      { name: 'Testimonials', href: '/testimonials' },
    ],
  },
  {
    name: 'Checklists',
    children: [
      { name: 'Cleaning Checklist', href: '/checklists/cleaning' },
      { name: 'Furnishing List', href: '/checklists/furnishing' },
      { name: 'Setup Checklist', href: '/checklists/setup' },
      { name: 'Printable Resources', href: '/checklists/printable' },
    ],
  },
  {
    name: 'Guides',
    children: [
      { name: 'Getting Started', href: '/guides/getting-started' },
      { name: 'Pro Tips', href: '/guides/pro-tips' },
      { name: 'Automation', href: '/guides/automation' },
      { name: 'Troubleshooting', href: '/guides/troubleshooting' },
    ],
  },
  {
    name: 'Industry News',
    children: [
      { name: 'Platform Updates', href: '/news/updates' },
      { name: 'Regulation Alerts', href: '/news/regulations' },
      { name: 'Market Trends', href: '/news/trends' },
    ],
  },
  {
    name: 'About',
    children: [
      { name: 'Our Story', href: '/about' },
      { name: 'Achievements/Press', href: '/about/press' },
    ],
  },
  {
    name: 'Connect',
    children: [
      { name: 'Airbnb Ambassador (affiliate)', href: '/connect/ambassador' },
      { name: 'Book a Consultation', href: '/connect/consultation' },
      { name: 'Join a Webinar', href: '/webinar' },
      { name: 'YouTube / Podcast / Socials', href: '/socials' },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <img
              src="/logo-2.svg" // Place your logo SVG in /public and reference it here
              alt="STR Specialist"
              className="h-10 w-auto"
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="p-2 rounded-md text-gray-600"
            onClick={() => setMobileOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-6">
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
                        child.children ? (
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
                        )
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-semibold text-gray-900 hover:text-indigo-600"
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Spacer for right side */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end"></div>
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
                  className="h-10 w-auto"
                  style={{ objectFit: 'contain' }}
                />
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 flex flex-col gap-2">
              {/* Show prominent links at top */}
              {navigation
                .filter((item) =>
                  ['Tools', 'Templates & Merch', 'Checklists'].includes(item.name)
                )
                .map((item) => (
                  <Disclosure key={item.name}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between items-center px-2 py-2 text-base font-semibold text-gray-900 hover:bg-gray-100 rounded">
                          {item.name}
                          {item.children && <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />}
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <div className="pl-4 flex flex-col gap-2">
                            {item.children?.map((child) =>
                              child.children ? (
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
                                <Link key={child.name} href={child.href} className="block text-gray-600 py-1">
                                  {child.name}
                                </Link>
                              )
                            )}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              {/* All other links */}
              <div className="mt-4 flex flex-col gap-2">
                {navigation
                  .filter(
                    (item) =>
                      !['Tools', 'Templates & Merch', 'Checklists', 'Connect'].includes(item.name)
                  )
                  .map((item) => (
                    <Disclosure key={item.name}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between items-center px-2 py-2 text-base font-semibold text-gray-900 hover:bg-gray-100 rounded">
                            {item.name}
                            {item.children && <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />}
                          </Disclosure.Button>
                          <Disclosure.Panel>
                            <div className="pl-4 flex flex-col gap-2">
                              {item.children?.map((child) =>
                                child.children ? (
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
                                  <Link key={child.name} href={child.href} className="block text-gray-600 py-1">
                                    {child.name}
                                  </Link>
                                )
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
              </div>
            </nav>
            {/* Sticky "Connect" Button */}
            <div className="fixed bottom-0 left-0 w-full max-w-xs bg-white border-t p-4 z-50">
              <Link
                href="/connect"
                className="block w-full text-center bg-indigo-600 text-white py-2 rounded-md font-bold"
                onClick={() => setMobileOpen(false)}
              >
                Connect
              </Link>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </header>
  )
}
