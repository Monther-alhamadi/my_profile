import { supabase } from './api'

const BUCKET = 'project-images'

export async function uploadImage(file: File, path: string): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })
  if (error) throw error

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return urlData.publicUrl
}

export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}

export function getImagePath(userId: string, folder: string, fileName: string): string {
  return `${userId}/${folder}/${Date.now()}-${fileName}`
}
