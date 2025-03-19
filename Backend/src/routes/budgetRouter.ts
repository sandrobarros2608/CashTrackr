import { Router } from 'express'
import { body, param } from 'express-validator'
import { BudgetController } from '../controllers/BudgetController';
import { handleInputErrors } from '../middleware/validation';
import { hasAccess, validateBudgetExists, validateBudgetId, validateBudgetInput } from '../middleware/budget';
import { ExpensesController } from '../controllers/ExpenseController';
import { validateExpenseExists, validateExpenseId, validateExpenseInput } from '../middleware/expense';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate) // req.user

// Validaciones cuando el parametro es id
// Se ejecutan los middlewares
router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExists) // req.budget
router.param('budgetId', hasAccess)

router.param('expenseId', validateExpenseId)
router.param('expenseId', validateExpenseExists)

// Rutas

router.get('/', BudgetController.getAll)

router.get('/:budgetId', BudgetController.getById)

router.post('/',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create)


router.put('/:budgetId',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateById)

router.delete('/:budgetId', BudgetController.deleteById)

// Rutas Expenses

router.get('/:budgetId/expenses/:expenseId',
    validateExpenseExists,
    handleInputErrors,
    ExpensesController.getById)

router.post('/:budgetId/expenses',
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create)

router.put('/:budgetId/expenses/:expenseId',
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.updateById)

router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById)


export default router