import { ProjectInterface } from "@/common.types";
import Modal from "@/components/Modal"
import ProjectForm from "@/components/ProjectForm"
import { getProjectDetail } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation";

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getCurrentUser();

  if (!session?.user) redirect('/')

  const result = await getProjectDetail(id) as { pg: { projects: ProjectInterface } }

  return (
    <Modal>
      <h3 className="modal-head-text">Edit Project</h3>
      <ProjectForm type="edit" session={session} project={result.pg.projects} />
    </Modal>
  )
}

export default EditProject