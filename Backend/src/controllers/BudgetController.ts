import type { Request, Response } from 'express'
import Budget from '../models/Budget';
import Expense from '../models/Expense';

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                // Filtrados
                order: [
                    ['createdAt', 'DESC']
                ],
                // TODO: Filtrar por el usuario autenticado
            });
            res.json(budgets);
            res.status(200);
        } catch (error) {
            res.status(404).json({ error: 'Presupuestos no encontrados' });
        }

    }

    static create = async (req: Request, res: Response) => {
        try {
            console.log(req.body);
            const budget = new Budget(req.body);
            await budget.save();
            res.status(201).json('Presupuesto Creado Correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static getById = async (req: Request, res: Response) => {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        })
        res.json(budget);
    }

    static updateById = async (req: Request, res: Response) => {
        await req.budget.update(req.body);
        res.status(200).json('Presupuesto Actualizado Correctamente');
    }

    static deleteById = async (req: Request, res: Response) => {
        await req.budget.destroy();
        res.status(200).json('Presupuesto Eliminado Correctamente');
    }
}