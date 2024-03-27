import { ProjectInterface, UserProfile } from "@/common.types";
import { getUserProject } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";

type Props = {
  userId: string;
  projectId: string;
}

const RelatedProjects = async ({ userId, projectId }: Props) => {
  const projectDetail = await getUserProject(userId) as { pg: { users: UserProfile } }
  const anotherprojects = projectDetail.pg.users.projects?.edges?.filter(
    ({ node }: { node: ProjectInterface }) => node?.projectId !== projectId)

  if (anotherprojects.length === 0) return null

  return (
    <section className="flex flex-col mt-32 w-full">
      <div className="flexBetween">
        <p className="text-base font-bold">More by {projectDetail.pg.users.name}</p>
        <Link href={`/profile/${projectDetail.pg.users.userId}`} className="text-primary-purple text-base">
          View All
        </Link>
      </div>

      <div className="related_projects-grid">
        {anotherprojects.map(({ node }: { node: ProjectInterface }) => (
          <div className="flexCenter related_project-card drop-shadow-card" key={node.projectId}>
            <Link href={`/project/${node.projectId}`} className="flexCenter group w-full h-full relative">
              <Image src={node.imageUrl} width={414} height={314} className='w-full h-full object-cover rounded-2xl' alt='project-image' />
              <div className="hidden group-hover:flex related_project-card_title">
                <p className="w-full">{node.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RelatedProjects