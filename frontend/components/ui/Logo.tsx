import Image from "next/image"

export default function Logo() {
    return (
        <Image
            src="/logo.svg"
            alt="Logo CashTrackr"
            width={0}
            height={0}
            className="w-full"
            priority />
    )
}
