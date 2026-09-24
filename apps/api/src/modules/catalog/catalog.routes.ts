import { Router } from "express";
import { database } from "../../infrastructure/database/client";
import { CatalogController } from "./catalog.controller";
import { CatalogRepository } from "./catalog.repository";
import { CatalogService } from "./catalog.service";

const repository = new CatalogRepository(database);
const service = new CatalogService(repository);
const controller = new CatalogController(service);

export const catalogRouter = Router();

catalogRouter.get("/projects", controller.listProjects);
catalogRouter.get("/projects/:projectId", controller.getProject);
catalogRouter.get("/projects/:projectId/scenarios", controller.listProjectScenarios);
