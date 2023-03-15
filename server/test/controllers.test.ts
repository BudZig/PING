import { Request, response, Response } from "express";
import mongoose from "mongoose";
import Tagline from "../models/Tagline";
import { getTaglines, postTagline } from "../controllers/taglineController";
import User from "../models/User";
import app from "..";
import request from 'supertest';

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
        const mockRequest = {} as Request;
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;

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
    });

    it('should handle errors correctly', async () => {
        const mockRequest = {} as Request;
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;

        jest.spyOn(Tagline, 'find').mockImplementation(() => {
            throw new Error('Mock Error');
        });

        await getTaglines(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Mock Error' });
    });
});

describe('postTagline', () => {
    it('should create a new tagline', async () => {
        const mockRequest = {
            body: {
                tagline: 'new tagline',
            },
        } as Request;
        const mockResponse = {
            status: jest.fn(). mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;

        await postTagline(mockRequest, mockResponse);

        const createdTagline = await Tagline.findOne({ tagline: 'new tagline' });

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(createdTagline).toBeTruthy();
    });

    it('should handle server errors', async () => {
        const mockRequest = {} as Request;
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;

        jest.spyOn(Tagline.prototype, 'save').mockImplementation(() => {
            throw new Error('Mock error');
        });

        await postTagline(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Mock error' });
    });
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
        });

        it('should get all users when there are any', async () => {
            const user1 = new User({ username: 'username1', email: 'user1@test.com', password: 'password1' });
            const user2 = new User({ username: 'username2', email: 'user2@test.com', password: 'password2' });
            await user1.save();
            await user2.save();

            const res = await request(app).get('/users');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe('getUser', () => {
        it('should get a user', async () => {
            const user = new User({ username: 'username', email: 'user@test.com', password: 'password' });
            await user.save();

            const res = await request(app).get('/users/username');
            expect(res.status).toBe(200);
            expect(res.body.username).toBe('username');
        });

        it('should return 404 if user does not exist', async () => {
            const res = await request(app).get('users/notAnActualUser');
            expect(res.status).toBe(404);
        });
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const user = { username: 'username', email: 'user@test.com', password: 'password' };

            const res = await request(app).post('/users').send(user);
            expect(res.status).toBe(201);
            expect(res.body.username).toBe('username');
        });

        it('should return 500 if user is not created', async () => {
            const user = { email: 'user@test.com', password: 'password' };

            const res = await request(app).post('/users').send(user);
            expect(res.status).toBe(500);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('updateUser', () => {
        it('should update the user', async () => {
            const user = new User({ username: 'username', email: 'user@test.com', password: 'password' });
            await user.save();

            const updatedUser = { socketID: 'socketID123', username: 'updatedusername', role: 'admin' };
            
            const res = await request(app).put('/users').send(updatedUser);
            expect(res.status).toBe(201);
            expect(res.body.username).toBe('updatedusername');

        })
    })
})