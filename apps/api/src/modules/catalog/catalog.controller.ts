import type { Request, Response } from "express";
import { z } from "zod";
import type { CatalogService } from "./catalog.service";

const projectParamsSchema = z.object({
  projectId: z.string().uuid(),
});

export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  listProjects = async (_request: Request, response: Response) => {
    const projects = await this.service.listProjects();
    response.json({ data: projects });
  };

  getProject = async (request: Request, response: Response) => {
    const { projectId } = projectParamsSchema.parse(request.params);
    const project = await this.service.getProject(projectId);
    response.json({ data: project });
  };

  listProjectScenarios = async (request: Request, response: Response) => {
    const { projectId } = projectParamsSchema.parse(request.params);
    const scenarios = await this.service.listProjectScenarios(projectId);
    response.json({ data: scenarios });
  };
}
