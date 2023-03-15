import { Request, Response } from "express";
import mongoose from "mongoose";
import Tagline from "../models/Tagline";
import { getTaglines, postTaglines } from "../controllers/taglineController";

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