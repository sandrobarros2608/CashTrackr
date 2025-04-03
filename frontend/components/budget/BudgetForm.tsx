import { Budget } from "@/src/shemas";

export default function BudgetForm({ budget }: { budget?: Budget }) {

    

    return (
        <>
            <div className="space-y-3">
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre Presupuesto
                </label>
                <input
                    id="name"
                    className="w-full p-3  border border-gray-100 bg-slate-100"
                    type="text"
                    placeholder="Nombre del Presupuesto"
                    name="name"
                    defaultValue={budget?.name}
                />
            </div>
            <div className="space-y-3">
                <label htmlFor="amount" className="text-sm uppercase font-bold">
                    Cantidad Presupuesto
                </label>
                <input
                    type="number"
                    id="amount"
                    className="w-full p-3  border border-gray-100 bg-slate-100"
                    placeholder="Cantidad Presupuesto"
                    name="amount"
                    defaultValue={budget?.amount}
                />
            </div>
        </>
    )
}
