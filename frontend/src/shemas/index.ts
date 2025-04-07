import { z } from 'zod'

export const RegisterSchema = z.object({
    email: z.string()
        .min(1, { message: 'El Email es obligatorio' })
        .email({ message: 'Email no válido' }),
    name: z.string()
        .min(1, { message: 'Tu nombre no puede ir vacio' }),
    password: z.string()
        .min(8, { message: 'El password es muy corto, minimo 8 caracteres' }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Los passwords no son iguales',
    path: ['password_confirmation']
})

export const LoginSchema = z.object({
    email: z.string()
        .min(1, { message: 'El Correo es obligatorio' })
        .email({ message: 'Correo no válido' }),
    password: z.string()
        .min(1, { message: 'La Contraseña no puede ir vacia' })
})

export const TokenSchema = z.string({ message: 'Token no válido' })
    .length(6, { message: 'Token no válido' })

export const SuccessSchema = z.string()

export const ErrorResponseSchema = z.object({
    error: z.string()
})

export const ResetPasswordSchema = z.object({
    password: z.string()
        .min(8, { message: 'La Contraseña debe ser de al menos 8 caracteres' }),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Las Contraseñas no son iguales",
    path: ["password_confirmation"]
});

export const ForgotPasswordSchema = z.object({
    email: z.string()
        .min(1, { message: 'El Correo es obligatorio' })
        .email({ message: 'Correo no válido' }),
})

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email()
})

export const ExpenseAPIResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    amount: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    budgetId: z.number(),
})

export const DraftBudgetSchema = z.object({
    name: z.string()
        .min(1, { message: 'El Nombre del presupuesto es obligatorio' }),
    amount: z.coerce.
        number({ message: 'Cantidad no válida' })
        .min(1, { message: 'Cantidad no válida' }),
})

export const BudgetAPIResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    amount: z.string(),
    userId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    expenses: z.array(ExpenseAPIResponseSchema)
})

export const BudgetsAPIResponseSchema = z.array(BudgetAPIResponseSchema.omit({ expenses: true }))

export const PasswordValidationShema = z.string().min(1, { message: 'Contraseña no válida' })

export const DraftExpenseShema = z.object({
    name: z.string().min(1, { message: 'el nombre del gasto es obligatorio' }),
    amount: z.coerce.number().min(1, { message: 'Cantidad no válida' })
})

export const UpdatePasswordSchema = z.object({
    current_password: z.string().min(1, { message: 'El Password no puede ir vacio' }),
    password: z.string()
        .min(8, { message: 'El Nuevo Password debe ser de al menos 8 caracteres' }),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Los Passwords no son iguales",
    path: ["password_confirmation"]
});

export const ProfileFormSchema = z.object({
    name: z.string()
            .min(1, {message: 'Tu Nombre no puede ir vacio'}),
    email: z.string()
            .min(1, {message: 'El Email es Obligatorio'})
            .email({message: 'Email no válido'}),
})

export type User = z.infer<typeof UserSchema>
export type Budget = z.infer<typeof BudgetAPIResponseSchema>
export type DraftExpense = z.infer<typeof DraftExpenseShema>
export type Expense = z.infer<typeof ExpenseAPIResponseSchema>