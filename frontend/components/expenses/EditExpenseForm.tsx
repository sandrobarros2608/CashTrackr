import { useEffect } from "react";
import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import { useParams, useSearchParams } from "next/navigation";

export default function EditExpenseForm({ closeModal }: { closeModal: () => void }) {

    const { id: budgetId } = useParams()

    const searchParams = useSearchParams()
    const expenseId = searchParams.get('editExpenseId')

    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_URL}/admin/api/budgets/${budgetId}/expenses/${expenseId}`
       console.log(url)
        fetch(url).then(res => res.json())
            .then(data => console.log(data))
    }, [])

    return (
        <>
            <DialogTitle
                as="h3"
                className="font-black text-4xl text-purple-950 my-5"
            >
                Editar Gasto
            </DialogTitle>
            <p className="text-xl font-bold">Edita los detalles de un {''}
                <span className="text-amber-500">gasto</span>
            </p>
            <form
                className="bg-gray-100 shadow-lg rounded-lg p-10 mt-10 border"
                noValidate
            >

                <ExpenseForm />

                <input
                    type="submit"
                    className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                    value='Guardar Cambios'
                />
            </form>
        </>
    )
}