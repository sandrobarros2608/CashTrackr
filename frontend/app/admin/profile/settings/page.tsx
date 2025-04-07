import ProfileForm from "@/components/profile/ProfileForm";
import { verifySession } from "@/src/auth/dal";

export default async function EditProfilePage() {

    const { user } = await verifySession()

    return (
        <>
            <h1 className="font-black text-4xl text-purple-950 my-5">Actualizar Perfil</h1>
            <p className="text-xl font-bold">Aquí puedes cambiar los datos de tu {''}
                <span className="text-amber-500">perfil</span>
            </p>

            <ProfileForm
                user={user}
            />
        </>
    )
}