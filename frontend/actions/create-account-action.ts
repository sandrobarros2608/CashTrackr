"use server"

type ActionStateType = {
    errors: string[],
    success: string
}

import { ErrorResponseSchema, RegisterSchema, SuccessSchema } from "@/src/shemas"

export async function register(prevState: ActionStateType, formData: FormData) {
    const registerData = {
        // Extraemos los datos que necesitamos
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation'),
    }

    // Validar
    const register = RegisterSchema.safeParse(registerData)

    if (!register.success) {
        const errors = register.error.errors.map(error => error.message)
        return {
            errors,
            success: prevState.success
        }
    }

    // Registrar el usuario
    const url = `${process.env.API_URL}/auth/create-account`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: register.data.name,
            email: register.data.email,
            password: register.data.password,
        })
    })

    const json = await req.json()

    if (req.status === 409) {
        const {error} = ErrorResponseSchema.parse(json)

        return {
            errors: [error],
            success: ''
        }
    }

    const success = SuccessSchema.parse(json)

    return {
        errors: [],
        success
    }
}