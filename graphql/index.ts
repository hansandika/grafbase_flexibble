export const getUserQuery = `
  query GetUser($email: String!) {
    pg {
      users(by: { email: $email }) {
        userId
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl
      }
    }
  }
`

export const createUserQuery = `
  mutation CreateUser($input: PgUsersCreateInput!) {
    pg {
      usersCreate(input: $input) {
        returning {
          userId
          name
          email
          avatarUrl
          description
          githubUrl
          linkedinUrl
        }
      }
    }
  }
`

export const createProjectQuery = `
  mutation CreateProject($input: PgProjectsCreateInput!) {
    pg {
      projectsCreate(input: $input) {
        returning {
          projectId
          title
          description
          liveSiteUrl
          githubUrl
          imageUrl
          createdBy
        }
      }
    }
  }
`

export const projectsQuery = `
  query getProjects($category: String!, $endcursor: String!) {
    pg{
      projectsCollection(first: 8, after: $endcursor, filter: {category: {eq: $category}}) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            title
            githubUrl
            description
            liveSiteUrl
            projectId
            imageUrl
            category
            createdBy
            users {
              userId
              name
              email
              avatarUrl
            }
          }
        }
      }
    }
  }
`;

export const getProjectByIdQuery = `
  query getProject($projectId: Int!) {
    pg {
      projects(by: { projectId: $projectId }) {
        projectId
        title
        description
        liveSiteUrl
        githubUrl
        imageUrl
        category
        createdBy
        users {
          userId
          name
          email
          avatarUrl
        }
      }
    }
  }
`;

export const getProjectOfUserQuery = `
  query getProjectsOfUser($userId: Int!) {
    pg {
      users(by: { userId: $userId }) {
        userId
        name
        email
        description
        avatarUrl
        githubUrl
        linkedinUrl
        projects(last: 5) {
          edges {
            node {
              projectId
              title
              description
              imageUrl
            }
          }
        }
      }
    }
  }
`;

export const deleteProjectQuery = `
  mutation DeleteProject($projectId: Int!) {
    pg {
      projectsDelete(by: { projectId: $projectId }) {
        returning {
          projectId
        }
      }
    }
  }
`;

export const updateProjectQuery = `
  mutation UpdateProject($projectId: Int!, $input: PgProjectsUpdateInput!) {
    pg {
      projectsUpdate(by: { projectId: $projectId }, input: $input) {
        returning {
          projectId
          title
          description
          liveSiteUrl
          githubUrl
          imageUrl
          category
          createdBy
        }
      }
    }
  }
`;