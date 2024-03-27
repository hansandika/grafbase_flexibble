import { UserProfile } from "@/common.types"
import ProfilePage from "@/components/ProfilePage"
import { getUserProject } from "@/lib/actions"

type Props = {
  params: {
    id: string
  }
}

const Profile = async ({ params: { id } }: Props) => {
  const result = await getUserProject(id) as { pg: { users: UserProfile } }
  if (!result.pg.users) {
    return <p className="no-result-text">Failed to fetch user info</p>
  }

  return (
    <ProfilePage user={result?.pg.users} />
  )
}

export default Profile