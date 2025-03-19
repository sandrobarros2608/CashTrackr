import request from 'supertest'
import server, { connectDB } from '../../server'
import { AuthController } from '../../controllers/AuthController'
import User from '../../models/User'
import * as authUtils from '../../utils/auth'
import * as jwtUtils from '../../utils/jwt'

describe('Authentication - Create Account', () => {
    it('Should display validation errors when form is empty', async () => {
        const response = await request(server)
            .post('/api/auth/create-account')
            .send({})
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)

        expect(response.statusCode).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(2)
        expect(createAccountMock).not.toHaveBeenCalled()
    })

    it('Should return 400 status code when the email is invalid', async () => {
        const response = await request(server)
            .post('/api/auth/create-account')
            .send({
                "name": "Edgar",
                "password": "12345678",
                "email": "not_valid_email"
            })
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.body.errors[0].msg).toBe('E-mail no válido')

        expect(response.statusCode).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(2)
        expect(createAccountMock).not.toHaveBeenCalled()
    })

    it('Should return 400 status code when the password is less than 8 characters', async () => {

        const userData = {
            "name": "Edgar",
            "password": "short",
            "email": "test@test.com"
        }

        const response = await request(server)
            .post('/api/auth/create-account')
            .send(userData)
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.body.errors[0].msg).toBe('El password es muy corto, minimo 8 caracteres')

        expect(response.statusCode).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(2)
        expect(createAccountMock).not.toHaveBeenCalled()
    })

    it('Should return 201 status code when the user is register successfully', async () => {

        const userData = {
            "name": "Pedro",
            "password": "12345678",
            "email": "pedro@gmail.com"
        }

        const response = await request(server)
            .post('/api/auth/create-account')
            .send(userData)

        expect(response.statusCode).toBe(201)

        expect(response.statusCode).not.toBe(204)
        expect(response.body).not.toHaveProperty('errors')
    })

    it('Should return 409 conflict whn a user is already registered', async () => {

        const userData = {
            "name": "Pedro",
            "password": "12345678",
            "email": "pedro@gmail.com"
        }

        const response = await request(server)
            .post('/api/auth/create-account')
            .send(userData)

        expect(response.statusCode).toBe(409)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('El usuario ya existe')

        expect(response.statusCode).not.toBe(400)
        expect(response.statusCode).not.toBe(201)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('Authentication - Account Confirmation with Token', () => {
    it('Should display error if token is empty or token is not valid', async () => {
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({
                token: "not_valid"
            })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Token no válido')
    })

    it('Should display error if token doesnt exists', async () => {
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({
                token: "123456"
            })

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Token no válido')
        expect(response.statusCode).not.toBe(200)
    })

    it('Should confirm account with a valid token', async () => {
        const token = globalThis.cashTrackerConfirmationToken

        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({ token })

        expect(response.status).toBe(200)
        expect(response.body).toBe('Cuenta confirmada correctamente')
        expect(response.status).not.toBe(401)
    })
})

describe('Authentication - Login', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Should display validation errors when the form is empty', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({})

        const loginMock = jest.spyOn(AuthController, 'login')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.body.errors).not.toHaveLength(1)
        expect(loginMock).not.toHaveBeenCalled()
    })

    it('Should return 400 bad request when the email is invalid', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": "12345678",
                "email": "not_valid"
            })

        const loginMock = jest.spyOn(AuthController, 'login')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('E-mail no es valido')

        expect(response.body.errors).not.toHaveLength(2)
        expect(loginMock).not.toHaveBeenCalled()
    })

    it('Should return a 400 error if the user is not found', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": "12345678",
                "email": "user@test.com"
            })

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Usuario no encontrado')

        expect(response.status).not.toBe(200)
    })

    it('Should return a 403 error if the user is not confirmed', async () => {

        (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: false,
                password: "hashedPassword",
                email: "user_not_confirmed@test.com"
            })

        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": "12345678",
                "email": "user_not_confirmed@test.com"
            })

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La Cuenta no ha sido confirmada')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
    })

    it('Should return a 401 error if the password is incorrect', async () => {

        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: true,
                password: "hashedPassword"
            })

        const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(false)

        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": "wrongPassword",
                "email": "test@test.com"
            })

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Password Incorrecto')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(403)

        expect(findOne).toHaveBeenCalledTimes(1)
        expect(checkPassword).toHaveBeenCalledTimes(1)
    })

    it('Should return a 401 error if the password is incorrect', async () => {

        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: true,
                password: "hashedPassword"
            })

        const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(true)
        const generateJWT = jest.spyOn(jwtUtils, 'generateJWT').mockReturnValue('jwt_token')

        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": "correctPassword",
                "email": "test@test.com"
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual('jwt_token')

        expect(findOne).toHaveBeenCalled()
        expect(findOne).toHaveBeenCalledTimes(1)

        expect(checkPassword).toHaveBeenCalled()
        expect(checkPassword).toHaveBeenCalledTimes(1)
        expect(checkPassword).toHaveBeenCalledWith('correctPassword', 'hashedPassword')

        expect(generateJWT).toHaveBeenCalled()
        expect(generateJWT).toHaveBeenCalledTimes(1)
        expect(generateJWT).toHaveBeenCalledWith(1)
    })
})

let jwt: string

async function authenticateUser() {
    const response = await request(server)
        .post('/api/auth/login')
        .send({
            email: 'pedro@gmail.com',
            password: '12345678'
        })
    jwt = response.body
    expect(response.status).toBe(200)
}

describe('GET /api/budgets', () => {


    beforeAll(() => {
        jest.restoreAllMocks() // Restaurar las funciones de los jest.spy a su implementacion original
    })

    beforeAll(async () => {
        await authenticateUser()
    })

    it('Should reject unauthenticated access to budgets without a jwt', async () => {
        const response = await request(server)
            .get('/api/budgets')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })

    it('Should allow authenticated access to budgets with a valid jwt', async () => {
        const response = await request(server)
            .get('/api/budgets')
            .auth(jwt, { type: 'bearer' })

        expect(response.body).toHaveLength(0)
        expect(response.status).not.toBe(401)
        expect(response.body.error).not.toBe('No Autorizado')
    })

    it('Should reject unauthenticated access to budgets without a valid jwt', async () => {
        const response = await request(server)
            .get('/api/budgets')
            .auth('not_valid', { type: 'bearer' })

        expect(response.status).toBe(500)
        expect(response.body.error).toBe('Token no válido')
    })
})

describe('POST /api/budgets', () => {

    beforeAll(async () => {
        await authenticateUser()
    })

    it('Should reject unauthenticated post request to budgets without a jwt', async () => {
        const response = await request(server)
            .post('/api/budgets')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })

    it('Should display validation when the form is submitted with invalid data', async () => {
        const response = await request(server)
            .post('/api/budgets')
            .send({})

            console.log(response)

        expect(response.status).toBe(401)
        expect(response.body.errors).toHaveLength(4)
    })
})