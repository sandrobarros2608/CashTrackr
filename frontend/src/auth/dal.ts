import "server-only"
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { UserSchema } from '../shemas'
import getToken from "./token"

// Data Access Layer
export const verifySession = cache(async () => {
    const token = getToken()
    if (!token) {
        redirect('/auth/login')
    }

    const url = `${process.env.API_URL}/auth/user`
    const req = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const session = await req.json()
    const result = UserSchema.safeParse(session)

    if (!result.success) {
        redirect('/auth/login')
    }

    return {
        user: result.data,
        isAuth: true
    }
})