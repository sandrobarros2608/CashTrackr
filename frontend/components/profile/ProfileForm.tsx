"use client"

import { updateUser } from "@/actions/update-user-action"
import { User } from "@/src/shemas"
import { useEffect } from "react"
import { useFormState } from "react-dom"
import { toast } from "react-toastify"
import ErrorMessage from "../ui/ErrorMessage"

export default function ProfileForm({ user }: { user: User }) {

    const [state, dispatch] = useFormState(updateUser, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
        }
    }, [state])

    return (
        <>
            <form
                className=" mt-14 space-y-5"
                noValidate
                action={dispatch}
            >
                {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
                <div className="flex flex-col gap-5">
                    <label
                        className="font-bold text-2xl"
                    >Nombre</label>
                    <input
                        type="name"
                        placeholder="Tu Nombre"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        name="name"
                        defaultValue={user.name}
                    />
                </div>
                <div className="flex flex-col gap-5">
                    <label
                        className="font-bold text-2xl"
                    >Correo</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Tu Correo"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        name="email"
                        defaultValue={user.email}
                    />
                </div>

                <input
                    type="submit"
                    value='Guardar Cambios'
                    className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
                />
            </form>
        </>
    )
}