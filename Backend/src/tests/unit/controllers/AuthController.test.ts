import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import User from "../../../models/User";
import { checkPassword, hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import { generateJWT } from "../../../utils/jwt";

jest.mock('../../../models/User')
jest.mock('../../../utils/auth')
jest.mock('../../../utils/token')
jest.mock('../../../utils/jwt')
describe('AuthController.createAccount', () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('Should return a 409 status and an error message if the email is already registered', async () => {

        (User.findOne as jest.Mock).mockResolvedValue(true)

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {
                email: 'test@test.com',
                password: 'testpassword'
            }
        })

        const res = createResponse()

        await AuthController.createAccount(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(409)
        expect(data).toHaveProperty('error', 'El usuario ya existe')
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)
    })

    it('Should register a new user and return a success message', async () => {

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {
                email: 'test@test.com',
                password: 'testpassword',
                name: 'Test Name'
            }
        })

        const res = createResponse();

        const mockUser = { ...req.body, save: jest.fn() };

        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
        (generateToken as jest.Mock).mockReturnValue('123456');
        jest.spyOn(AuthEmail, "sendConfirmationEmail").mockImplementation(() => Promise.resolve());

        await AuthController.createAccount(req, res)

        expect(User.create).toHaveBeenCalledWith(req.body)
        expect(User.create).toHaveBeenCalledTimes(1)
        expect(mockUser.save).toHaveBeenCalled()
        expect(mockUser.password).toBe('hashedPassword')
        expect(mockUser.token).toBe('123456')
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            token: '123456'
        })

        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
        expect(res.statusCode).toBe(201)

    })
})

describe('AuthController.login', () => {
    it('Should return a 404 status if is not found', async () => {

        (User.findOne as jest.Mock).mockResolvedValue(null)
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: "test@test.com",
                password: "123456789"
            }
        })

        const res = createResponse()

        await AuthController.login(req, res)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(404)
        expect(data).toEqual({ error: 'Usuario no encontrado' })

    })

    it('should return 403 status if account has not been confirmed', async () => {

        (User.findOne as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'test@test.com',
            password: '123456789',
            confirmed: false
        })
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: "test@test.com",
                password: "123456789"
            }
        })

        const res = createResponse()

        await AuthController.login(req, res)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(403)
        expect(data).toEqual({ error: 'La Cuenta no ha sido confirmada' })

    })

    it('should return 401 if the password is incorrect', async () => {

        (User.findOne as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'test@test.com',
            password: '12345678910',
            confirmed: true
        })

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: "test@test.com",
                password: "123456789"
            }
        })

        const res = createResponse();

        (checkPassword as jest.Mock).mockResolvedValue(false)

        await AuthController.login(req, res)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(401)
        expect(data).toEqual({ error: 'Password Incorrecto' })
        expect(checkPassword).toHaveBeenCalledTimes(1)


    })

    it('should return a JWT if authentication is successful', async () => {

        const userMock = {
            id: 1,
            email: 'test@test.com',
            password: 'hashed_password',
            confirmed: true
        };

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: "test@test.com",
                password: "password"
            }
        })

        const res = createResponse();

        const fakeJwt = 'fake_jwt';

        (User.findOne as jest.Mock).mockResolvedValue(userMock);
        (checkPassword as jest.Mock).mockResolvedValue(true);
        (generateJWT as jest.Mock).mockReturnValue(fakeJwt);

        await AuthController.login(req, res)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(200)
        expect(data).toEqual(fakeJwt)
        expect(generateJWT).toHaveBeenCalledTimes(1)
        expect(generateJWT).toHaveBeenCalledWith(userMock.id)

    })
})
