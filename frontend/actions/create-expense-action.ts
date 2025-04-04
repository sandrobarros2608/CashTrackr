"use server"

import getToken from "@/src/auth/token"
import { DraftExpenseShema, ErrorResponseSchema, SuccessSchema } from "@/src/shemas"
import { revalidatePath } from "next/cache"

type ActionStateType = {
    errors: string[],
    success: string
}

export default async function createExpense(budgetId: number, prevState: ActionStateType, formData: FormData) {

    const expenseData = {
        name: formData.get('name'),
        amount: formData.get('amount')
    }

    const expense = DraftExpenseShema.safeParse(expenseData)
    if (!expense.success) {
        return {
            errors: expense.error.errors.map(issue => issue.message),
            success: ''
        }
    }

    const token = getToken()
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses`
    const req = await fetch(url, {
        method: 'POST',
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
        const { error } = ErrorResponseSchema.parse(json)
        return {
            errors: [error],
            success: ''
        }
    }

    revalidatePath(`/admin/budgets/${budgetId}`)
    const success = SuccessSchema.parse(json)

    return {
        errors: [],
        success
    }
}