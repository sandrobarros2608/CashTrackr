"use client"
import { Fragment } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import AddExpenseForm from '../expenses/AddExpenseForm';
import EditExpenseForm from '../expenses/EditExpenseForm';
import DeleteExpenseForm from '../expenses/DeleteExpenseForm';

const componentsMap = {
    "AddExpense": AddExpenseForm,
    "EditExpense": EditExpenseForm,
    "DeleteExpense": DeleteExpenseForm,
}

export default function ModalContainer() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const showModal = searchParams.get('showModal')

    const show = showModal ? true : false

    const addExpense = searchParams.get('addExpense')
    const editExpense = searchParams.get('editExpenseId')

    const getComponentName = () => {
        if (addExpense) return 'AddExpense'
        if (editExpense) return 'EditExpense'
    }

    const componentName = getComponentName()

    const ComponentToRender = componentName ? componentsMap[componentName]: null

    const closeModal = () => {
        const hideModal = new URLSearchParams(searchParams.toString())
        Array.from(hideModal.entries()).forEach(([key]) => {
            hideModal.delete(key)
        });
        router.replace(`${pathname}?${hideModal}`)
    }

    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    {ComponentToRender ? <ComponentToRender closeModal={closeModal}/> : null}
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}