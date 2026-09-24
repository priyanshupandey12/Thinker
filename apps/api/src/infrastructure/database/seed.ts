import { eq } from "drizzle-orm";
import { database, pool } from "./client";
import { projects, scenarios } from "./schema";

const existingProject = await database.query.projects.findFirst({
  where: eq(projects.slug, "product-api"),
});

if (!existingProject) {
  const [project] = await database
    .insert(projects)
    .values({
      slug: "product-api",
      name: "Thinker Product API",
      description: "A controlled product API for engineering reasoning scenarios.",
      sourceType: "thinker",
      status: "active",
    })
    .returning({ id: projects.id });

  if (!project) {
    throw new Error("The initial project could not be created.");
  }

  await database.insert(scenarios).values({
    projectId: project.id,
    slug: "product-read-overload",
    title: "Product Read Overload",
    description: "Investigate repeated database work before choosing a solution.",
    difficulty: "beginner",
    status: "active",
  });
}

await pool.end();
