import { Request, Response, NextFunction } from "express";
import { param, validationResult, body } from "express-validator";
import Expense from "../models/Expense";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
        .notEmpty().withMessage('El nombre del gasto es obligatorio').run(req)

    await body('amount')
        .notEmpty().withMessage('El monto del gasto es obligatorio')
        .isNumeric().withMessage('El monto del gasto debe ser numérico')
        .custom(value => value > 0).withMessage('El monto del gasto debe ser mayor a 0').run(req)

    next()
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId').isInt().custom(value => value > 0)
        .withMessage('ID no válido')
        .run(req)

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }
    next()
}

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params
        const expense = await Expense.findByPk(expenseId);
        if (!expense) {
            const error = new Error("Gasto no encontrado");
            res.status(404).json({ error: error.message });
            return
        }
        req.expense = expense;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}

export const belongsToBudget = async (req: Request, res: Response, next: NextFunction) => {
    if (req.budget.id != req.expense.budget.id) {
        const error = new Error('Acción no válida')
        res.status(403).json({ json: error.message })
        return
    }
    next()
}