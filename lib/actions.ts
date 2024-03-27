import { ProjectForm } from "@/common.types";
import { createProjectQuery, createUserQuery, deleteProjectQuery, getProjectByIdQuery, getProjectOfUserQuery, getUserQuery, projectsQuery, updateProjectQuery } from "@/graphql";
import { GraphQLClient } from "graphql-request";
import { cache } from "react";

const isProduction = process.env.NODE_ENV === 'production'
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : '1234567890';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL || '' : 'http://localhost:3000';

const client = new GraphQLClient(apiUrl, {
  fetch: cache(async (url: RequestInfo | URL, params: any) =>
    fetch(url, { ...params, cache: 'no-store' })
  ),
})

const makeGraphQLRequest = async (query: string, variables: any) => {
  try {
    return await client.request(query, variables);
  } catch (error) {
    throw (error)
  }
}

export const getUser = (email: string) => {
  client.setHeader('x-api-key', apiKey);
  return makeGraphQLRequest(getUserQuery, { email })
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader('x-api-key', apiKey);
  const variables = {
    input: {
      name, email, avatarUrl
    }
  }
  return makeGraphQLRequest(createUserQuery, variables)
}

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`)
    return response.json()
  } catch (error) {
    throw error;
  }
}

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: 'POST',
      body: JSON.stringify({ path: imagePath }),
    })

    return response.json()
  } catch (error) {
    throw error;
  }
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
  client.setHeader('x-api-key', apiKey);

  const imageUrl = await uploadImage(form.imageUrl)
  if (imageUrl.url) {
    client.setHeader('Authorization', `Bearer ${token}`);
    const variables = {
      input: {
        title: form.title,
        description: form.description,
        imageUrl: imageUrl.url,
        liveSiteUrl: form.liveSiteUrl,
        githubUrl: form.githubUrl,
        category: form.category,
        createdBy: parseInt(creatorId, 10)
      }
    }
    return makeGraphQLRequest(createProjectQuery, variables)
  }
}

export const fetchAllProjects = async (category?: string, endcursor?: string) => {
  client.setHeader('x-api-key', apiKey);
  return makeGraphQLRequest(projectsQuery, { category, endcursor })
}

export const getProjectDetail = async (projectId: string) => {
  const id = parseInt(projectId, 10)
  client.setHeader('x-api-key', apiKey);
  return makeGraphQLRequest(getProjectByIdQuery, { projectId: id })
}

export const getUserProject = async (userId: string) => {
  const id = parseInt(userId, 10)
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getProjectOfUserQuery, { userId: id })
}

export const deleteProject = async (projectId: string, token: string) => {
  const id = parseInt(projectId, 10)
  client.setHeader('x-api-key', apiKey)
  client.setHeader('Authorization', `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectQuery, { projectId: id })
}

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
  function isBase64DataUrl(s: string) {
    return s.startsWith('data:image/');
  }

  let updatedForm = { ...form }
  const isUploadingNewImage = isBase64DataUrl(form.imageUrl)

  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.imageUrl)

    if (imageUrl.url) {
      updatedForm = {
        ...form,
        imageUrl: imageUrl.url
      }
    }
  }

  client.setHeader('x-api-key', apiKey)
  client.setHeader('Authorization', `Bearer ${token}`);
  const id = parseInt(projectId, 10)

  const variables = {
    projectId: id,
    input: {
      title: {
        set: updatedForm.title
      },
      description: {
        set: updatedForm.description
      },
      imageUrl: {
        set: updatedForm.imageUrl
      },
      liveSiteUrl: {
        set: updatedForm.liveSiteUrl
      },
      githubUrl: {
        set: updatedForm.githubUrl
      },
      category: {
        set: updatedForm.category
      }
    }
  }

  return makeGraphQLRequest(updateProjectQuery, variables)
}