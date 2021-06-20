import './util/module-alias';
import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import { ForecastsController } from './controllers/forecasts';

export class SetupServer extends Server {

    /*
     * same as this.port = port, declaring as private here will
     * add the port variable to the SetupServer instance
     */
    constructor(private port = 3000) {
        super();
    }

    /*
     * We use a different method to init instead of using the constructor
     * this way we allow the server to be used in tests and normal initialization
     */
    public async init(): Promise<void> {
        this.setupExpress();
        this.setupControllers();
    }

    private setupExpress(): void {
        this.app.use(express.json());
        this.setupControllers();
    }

    private setupControllers(): void {
        const forecastsController = new ForecastsController();
        this.addControllers([forecastsController]);
    }

    public getApp(): Application {
        return this.app;
    }
}