import { User, Session } from 'next-auth'

export type FormState = {
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
};

export interface ProjectInterface {
  title: string;
  description: string;
  imageUrl: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
  projectId: string;
  createdBy: string;
  users: {
    userId: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  description: string | null;
  avatarUrl: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  projects: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

export interface SessionInterface extends Session {
  user: User & {
    userId: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

export interface ProjectForm {
  title: string;
  description: string;
  imageUrl: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
}