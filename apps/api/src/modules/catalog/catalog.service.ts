import { NotFoundError } from "../../shared/errors/app-error";
import type { CatalogRepository } from "./catalog.repository";

export class CatalogService {
  constructor(private readonly repository: CatalogRepository) {}

  listProjects() {
    return this.repository.listActiveProjects();
  }

  async getProject(projectId: string) {
    const project = await this.repository.findProjectById(projectId);

    if (!project) {
      throw new NotFoundError("PROJECT_NOT_FOUND", "The requested project could not be found.");
    }

    return project;
  }

  async listProjectScenarios(projectId: string) {
    await this.getProject(projectId);
    return this.repository.listActiveScenarios(projectId);
  }
}
