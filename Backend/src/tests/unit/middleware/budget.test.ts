import { createRequest, createResponse } from "node-mocks-http"
import { hasAccess, validateBudgetExists } from "../../../middleware/budget";
import Budget from '../../../models/Budget'
import { budgets } from "../../mocks/budgets";

jest.mock('../../../models/Budget', () => ({
    findByPk: jest.fn()
}))
describe('Budget Middleware - validateBudgetExists', () => {
    it('Should handle non-existent budget', async () => {

        (Budget.findByPk as jest.Mock).mockResolvedValue(null)

        const req = createRequest({
            params: {
                budgetId: 1
            }
        })
        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExists(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: 'Presupuesto no encontrado' });
        expect(next).not.toHaveBeenCalled();
    })

    it('Should proceed to next middleware if budget exists', async () => {

        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0])

        const req = createRequest({
            params: {
                budgetId: 1
            }
        })
        const res = createResponse()
        const next = jest.fn()

        await validateBudgetExists(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(req.budget).toEqual(budgets[0])
    })

    it('Should handle internal server error', async () => {

        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error)

        const req = createRequest({
            params: {
                budgetId: 1
            }
        })
        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExists(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: 'Hubo un error' });
        expect(next).not.toHaveBeenCalled();
    })
})

describe('Budget Middleware - hasAccess', () => {
    it('Should call next() if user has access to budget', () => {
        const req = createRequest({
            budget: budgets[0],
            user: { id: 1 }
        })
        const res = createResponse();
        const next = jest.fn();

        hasAccess(req, res, next);
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1);
    })

    it('Should return 401 error if userId does not havee access to budget', () => {
        const req = createRequest({
            budget: budgets[0],
            user: { id: 2 }
        })
        const res = createResponse();
        const next = jest.fn();

        hasAccess(req, res, next);
        const data = res._getJSONData();
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
        expect(data).toEqual({ error: 'Accion no valida' })
    })
})