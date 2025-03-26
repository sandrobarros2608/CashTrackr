import type { Metadata } from 'next'
import Link from 'next/link'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
    title: "CashTrackr - Olvidé mi contraseña",
    description: "CashTrackr - Olvidé mi contraseña"
}

export default function ForgotPasswordPage() {

    return (
        <>
            <h1 className="font-black text-6xl text-purple-950">¿Olvidate tu Contraseña?</h1>
            <p className="text-3xl font-bold">aquí puedes <span className="text-amber-500">reestrablecerla</span></p>

            <ForgotPasswordForm />

            <nav className='mt-10 flex flex-col space-y-4'>
                <Link
                    href='/auth/login'
                    className='text-center text-grey-500'
                >
                    ¿Ya tienes cuenta? Iniciar Sesión
                </Link>

                <Link
                    href='/auth/register'
                    className='text-center text-grey-500'
                >
                    ¿No tienes una cuenta? Crear una
                </Link>
            </nav>
        </>
    )
}
