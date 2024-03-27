import { ProjectInterface } from "@/common.types";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects } from "@/lib/actions";

type ProjectCollection = {
  pg: {
    projectsCollection: {
      edges: {
        node: ProjectInterface
      }[],
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
      }
    }
  }
}

type Props = {
  searchParams: {
    category?: string;
    endcursor?: string;
  }
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default async function Home({ searchParams: { category, endcursor } }: Props) {
  console.log(`EndCursor: ${endcursor}`)
  const data = await fetchAllProjects(category, endcursor) as ProjectCollection;
  const projectToDisplay = data.pg.projectsCollection.edges || []

  if (projectToDisplay.length == 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />

        <p className="no-result-text text-center">No Project Found, please create some first</p>
      </section>
    )
  }

  const pagination = data.pg.projectsCollection.pageInfo;

  return (
    <section className="flex-start flex-col paddings mb-16">
      <Categories />

      <section className="projects-grid">
        {projectToDisplay.map(({ node }: { node: ProjectInterface }) => (
          <ProjectCard
            key={node?.projectId}
            id={node?.projectId}
            image={node?.imageUrl}
            title={node?.title}
            name={node.users.name}
            avatarUrl={node.users.avatarUrl}
            userId={node.users.userId}
          />
        ))}
      </section>

      <LoadMore
        startCursor={pagination.startCursor}
        endCursor={pagination.endCursor}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
      />
    </section>
  );
}
