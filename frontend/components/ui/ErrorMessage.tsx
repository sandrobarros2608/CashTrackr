export default function ErrorMessage({ children }: { children: React.ReactNode }) {
    return (
        <>
            <p className="text-center my-4 bg-red-600 text-white text-bold p-5 uppercase text-sm">{children}</p>
        </>
    )
}
