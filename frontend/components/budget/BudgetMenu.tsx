"use client"
import { Fragment } from "react"
import Link from "next/link"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { Budget } from "@/src/shemas"
import { useRouter } from "next/navigation"

export default function BudgetMenu({ budgetId }: { budgetId: Budget['id'] }) {

    const router = useRouter()

    return (
        <>
            <Menu as="div" className="relative flex-none">
                <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                </MenuButton>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <MenuItem>
                            <Link
                                href={`admin/budget/${budgetId}`}
                                className='block px-3 py-1 text-sm leading-6 text-gray-900'
                            >
                                Ver Presupuesto
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link
                                href={`admin/budget/${budgetId}/edit`}
                                className='block px-3 py-1 text-sm leading-6 text-gray-900'
                            >
                                Editar Presupuesto
                            </Link>
                        </MenuItem>

                        <MenuItem>
                            <button
                                type='button'
                                className='block px-3 py-1 text-sm leading-6 text-red-500'
                                onClick={() => router.push(`?deleteBudgetId=${budgetId}`)}
                            >
                                Eliminar Presupuesto
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Transition>
            </Menu>
        </>
    )
}