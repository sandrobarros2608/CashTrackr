import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
    title: "CashTrackr - Iniciar Sesión",
    description: "CashTrackr - Iniciar Sesión"
}

export default function LoginPage() {

    return (
        <>
            <h1 className="font-black text-6xl text-purple-950">Iniciar Sesión</h1>
            <p className="text-3xl font-bold">y controla tus <span className="text-amber-500">finanzas</span></p>

            <LoginForm />

            <nav className='mt-10 flex flex-col space-y-4'>
                <Link
                    href='/auth/register'
                    className='text-center text-grey-500'
                >
                    ¿No tienes una cuenta? Crear una
                </Link>

                <Link
                    href='/auth/forgot-password'
                    className='text-center text-grey-500'
                >
                    ¿Olvidaste tu contraseña? Reestrablecer
                </Link>
            </nav>
        </>
    )
}
