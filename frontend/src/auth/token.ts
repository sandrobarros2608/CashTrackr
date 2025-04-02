import { cookies } from "next/headers";

export default function getToken() {
    const token = cookies().get('CASHTRACKR_TOKEN')?.value
    return token
}