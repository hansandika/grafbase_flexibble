'use client';

import { ProjectInterface, SessionInterface } from '@/common.types'
import Image from 'next/image';
import React, { useState } from 'react'
import FormField from './FormField';
import { categoryFilters } from '@/constants';
import CustomMenu from './CustomMenu';
import Button from './Button';
import { createNewProject, fetchToken, updateProject } from '@/lib/actions';
import { useRouter } from 'next/navigation';

type Props = {
  type: string,
  session: SessionInterface,
  project?: ProjectInterface
}

const ProjectForm = ({ type, session, project }: Props) => {
  const router = useRouter();

  const [form, setForm] = useState({
    imageUrl: project?.imageUrl || '',
    title: project?.title || '',
    description: project?.description || '',
    liveSiteUrl: project?.liveSiteUrl || '',
    githubUrl: project?.githubUrl || '',
    category: project?.category || ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true)

    const { token } = await fetchToken();

    try {
      if (type === 'create') {
        await createNewProject(form, session?.user?.userId, token)
        router.push('/')
      }
      if (type === 'edit') {
        await updateProject(form, project?.projectId as string, token)
        router.push('/')
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes('image')) {
      return alert('Please upload an image file')
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;

      handleStateChange('imageUrl', result)
    }
  }

  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value
    }))
  }

  return (
    <form onSubmit={handleFormSubmit} className='flexStart form'>
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className='flexCenter form_image-label'>
          {!form.imageUrl && 'Choose a poster for your project'}
        </label>
        <input id="image" type="file" accept='image/*' required={type === 'create'} className='form_image-input' onChange={handleChangeImage} />
        {form.imageUrl && <Image src={form?.imageUrl} className='sm:p-10 object-contain z-20' alt='Project Poster' fill />}
      </div>

      <FormField
        title="Title"
        state={form.title}
        placeholder="Flexxible"
        setState={(value) => handleStateChange('title', value)} />
      <FormField
        title="Description"
        state={form.description}
        placeholder="Showcase and discover remarkable developer projects."
        setState={(value) => handleStateChange('description', value)} />
      <FormField
        type="url"
        title="Website URL"
        state={form.liveSiteUrl}
        placeholder="https://flexxible.com"
        setState={(value) => handleStateChange('liveSiteUrl', value)} />
      <FormField
        type="url"
        title="Github URL"
        state={form.githubUrl}
        placeholder="https://github.com"
        setState={(value) => handleStateChange('githubUrl', value)} />

      {/* Custom Input For Category */}
      <CustomMenu
        title='Category'
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange('category', value)} />

      <div className='flexStart w-full'>
        <Button
          title={isSubmitting ?
            `${type === 'create' ? 'Creating' : 'Editing'}` :
            `${type === 'create' ? 'Create' : 'Edit'}`}
          type='submit'
          leftIcon={isSubmitting ? '' : '/plus.svg'}
          isSubmitting={isSubmitting} />
      </div>
    </form>
  )
}

export default ProjectForm