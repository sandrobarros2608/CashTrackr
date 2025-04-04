"use client"

import { useRouter } from "next/navigation"

export default function AddExpenseButton() {

    const router = useRouter()

    return (
        <button
            type='button'
            className="bg-amber-500 px-10 py-2 rounded-lg text-white font-bold cursor-pointer"
            onClick={() => router.push(location.pathname + '?addExpense=true&showModal=true')}
        >Agregar Gasto</button>
    )
}