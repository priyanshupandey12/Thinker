import { and, asc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../infrastructure/database/schema";
import { projects, scenarios } from "../../infrastructure/database/schema";

export class CatalogRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  listActiveProjects() {
    return this.db
      .select({
        id: projects.id,
        slug: projects.slug,
        name: projects.name,
        description: projects.description,
        sourceType: projects.sourceType,
        status: projects.status,
      })
      .from(projects)
      .where(eq(projects.status, "active"))
      .orderBy(asc(projects.name));
  }

  async findProjectById(projectId: string) {
    const [project] = await this.db
      .select({
        id: projects.id,
        slug: projects.slug,
        name: projects.name,
        description: projects.description,
        sourceType: projects.sourceType,
        status: projects.status,
      })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    return project;
  }

  listActiveScenarios(projectId: string) {
    return this.db
      .select({
        id: scenarios.id,
        slug: scenarios.slug,
        title: scenarios.title,
        description: scenarios.description,
        difficulty: scenarios.difficulty,
        status: scenarios.status,
      })
      .from(scenarios)
      .where(and(eq(scenarios.projectId, projectId), eq(scenarios.status, "active")))
      .orderBy(asc(scenarios.title));
  }
}
