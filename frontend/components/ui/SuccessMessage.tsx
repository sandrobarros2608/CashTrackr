export default function SuccessMessage({ children }: { children: React.ReactNode }) {
    return (
        <>
            <p className="text-center my-4 bg-amber-500 text-white text-bold p-5 uppercase text-sm">{children}</p>
        </>
    )
}
