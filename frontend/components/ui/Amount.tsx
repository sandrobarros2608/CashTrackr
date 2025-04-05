import { formatCurrency } from "@/src/utils"

type AmountProps = {
    label: string,
    amount: number
}

export default function Amount({ label, amount }: AmountProps) {
    return (
        <p className="text-2xl font-bold">
            {label}: {''}
            <span className="text-amber-500">{formatCurrency(amount)}</span>
        </p>
    )
}
