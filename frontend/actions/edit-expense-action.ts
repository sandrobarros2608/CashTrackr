"use server"

import getToken from "@/src/auth/token"
import { Budget, DraftExpenseShema, ErrorResponseSchema, Expense, SuccessSchema } from "@/src/shemas"
import { revalidatePath } from "next/cache"

type BudgetAndExpenseId = {
    budgetId: Budget['id'],
    expenseId: Expense['id']
}

type ActionStateType = {
    errors: string[],
    success: string
}

export default async function editExpense(
    { budgetId, expenseId }: BudgetAndExpenseId,
    prevState: ActionStateType,
    formData: FormData) {

    const expense = DraftExpenseShema.safeParse({
        name: formData.get('name'),
        amount: formData.get('amount')
    })

    if (!expense.success) {
        return {
            errors: expense.error.errors.map(issue => issue.message),
            success: ''
        }
    }

    const token = getToken()
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: expense.data.name,
            amount: expense.data.amount
        })
    })

    const json = await req.json()

    if (!req.ok) {
        const {error} = ErrorResponseSchema.parse(json)
        return {
            errors: [error],
            success: ''
        }
    }

    const success = SuccessSchema.parse(json)
    revalidatePath(`/admin/budgets/${budgetId}`)

    return {
        errors: [],
        success
    }
}