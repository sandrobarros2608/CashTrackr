"use client"

import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { User } from '@/src/shemas'
import { logout } from '@/actions/logout-user-action'

export default function AdminMenu({ user }: { user: User }) {

    return (
        <Popover className="relative">
            <PopoverButton className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-amber-500">
                <Bars3Icon className='w-8 h-8 text-white ' />
            </PopoverButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <PopoverPanel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
                    <div className="w-full lg:w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
                        <p className='text-center'>Hola: {user.name}</p>
                        <Link
                            href='/admin/profile/settings'
                            className='block p-2 hover:text-purple-950'
                        >Mi Perfil</Link>
                        <Link
                            href='/admin'
                            className='block p-2 hover:text-purple-950'
                        >Mis Presupuestos</Link>
                        <button
                            className='block p-2 hover:text-purple-950'
                            type='button'
                            onClick={async () => {
                                await logout()
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </PopoverPanel>
            </Transition>
        </Popover>
    )
}