import { useEffect, useState } from "react";
import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import { useParams, useSearchParams } from "next/navigation";
import { DraftExpense } from "@/src/shemas";
import { useFormState } from "react-dom";
import editExpense from "@/actions/edit-expense-action";
import ErrorMessage from "../ui/ErrorMessage";
import { toast } from "react-toastify";

export default function EditExpenseForm({ closeModal }: { closeModal: () => void }) {
    const [expense, setExpense] = useState<DraftExpense>()
    const { id: budgetId } = useParams()
    const searchParams = useSearchParams()
    const expenseId = +searchParams.get('editExpenseId')!

    const editExpenseWithBudgetId = editExpense.bind(null, {
        budgetId: +budgetId,
        expenseId: +expenseId
    })
    const [state, dispatch] = useFormState(editExpenseWithBudgetId, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_URL}/admin/api/budgets/${budgetId}/expenses/${expenseId}`
        console.log(url)
        fetch(url).then(res => res.json())
            .then(data => setExpense(data))
    }, [])

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            closeModal()
        }
    }, [state])

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

            {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
            <form
                className="bg-gray-100 shadow-lg rounded-lg p-10 mt-10 border"
                noValidate
                action={dispatch}
            >

                <ExpenseForm
                    expense={expense}
                />

                <input
                    type="submit"
                    className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                    value='Guardar Cambios'
                />
            </form>
        </>
    )
}