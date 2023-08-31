const mongoose = require('mongoose');
const Tagline = require('../models/Tagline').default;
const { getTaglines, postTagline } = require("../controllers/taglineController");
const User = require('../models/User').default;
const app = require('..').default;
const request = require('supertest');

describe('taglineController', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://P1ro:oDOaxYB8Du3Y9GJx@piro.f8cbqeh.mongodb.net/ping?retryWrites=true&w=majority')
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('getTaglines', () => {
    it('should return all taglines', async () => {
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await Tagline.create({
            tagline: 'test',
        });

        await getTaglines(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    tagline: 'test',
                }),
            ])
        );
    }, 50000);

    it('should handle errors correctly', async () => {
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        jest.spyOn(Tagline, 'find').mockImplementation(() => {
            throw new Error('Mock Error');
        });

        await getTaglines(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Error: Mock Error' });
    }, 10000);
});

describe('postTagline', () => {
    it('should create a new tagline', async () => {
        const mockRequest = {
            body: {
                tagline: 'new tagline',
            },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await postTagline(mockRequest, mockResponse);

        const createdTagline = await Tagline.findOne({ tagline: 'new tagline' });

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(createdTagline).toBeTruthy();
    });

    it('should handle server errors', async () => {
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        jest.spyOn(Tagline.prototype, 'save').mockImplementation(() => {
            throw new Error('Mock error');
        });

        await postTagline(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Error: Mock error' });
    }, 10000);
});

describe('userController', () => {
    beforeAll(async () => {
        await User.deleteMany({});
    });

    describe('getAllUsers', () => {
        it('should get all users', async () => {
            const res = await request(app).get('/users');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        }, 10000);

        it('should get all users when there are any', async () => {
            const user1 = new User({ username: 'username1', email: 'user1@test.com', password: 'password1' });
            const user2 = new User({ username: 'username2', email: 'user2@test.com', password: 'password2' });
            await user1.save();
            await user2.save();

            const res = await request(app).get('/users');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        }, 10000);
    });

    describe('getUser', () => {
        it('should get a user', async () => {
            const user = new User({ username: 'username', email: 'user@test.com', password: 'password' });
            await user.save();

            const res = await request(app).get('/users/username');
            expect(res.status).toBe(200);
            expect(res.body.username).toBe('username');
        }, 10000);

        it('should return 404 if user does not exist', async () => {
            const res = await request(app).get('users/notAnActualUser');
            expect(res.status).toBe(404);
        }, 10000);
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const user = { username: 'username', email: 'user@test.com', password: 'password' };

            const res = await request(app).post('/users').send(user);
            expect(res.status).toBe(201);
            expect(res.body.username).toBe('username');
        }, 10000);

        it('should return 500 if user is not created', async () => {
            const user = { email: 'user@test.com', password: 'password' };

            const res = await request(app).post('/users').send(user);
            expect(res.status).toBe(500);
            expect(res.body.error).toBeDefined();
        }, 10000);
    });

    describe('updateUser', () => {
        it('should update the user', async () => {
            const user = new User({ username: 'username', email: 'user@test.com', password: 'password' });
            await user.save();

            const updatedUser = { socketID: 'socketID123', username: 'updatedusername', role: 'admin' };
            
            const res = await request(app).put('/users').send(updatedUser);
            expect(res.status).toBe(201);
            expect(res.body.username).toBe('updatedusername');
        }, 10000);

        it('should return 500 if user is not updated', async () => {
            const user = new User({ username: 'username', email: 'user@test.com', password: 'password' });
            await user.save();

            const updatedUser = { socketID: 'socketid123', email: 'testuser2@test.com', password: 'newpassword' };

            const response = await request(app).put('/users').send(updatedUser);
            expect(response.status).toBe(500);
            expect(response.body.error).toBeDefined();
        }, 10000);
    });
})