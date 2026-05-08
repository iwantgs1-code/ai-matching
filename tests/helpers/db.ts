import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://obaxnmhnukvihirllnvr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iYXhubWhudWt2aWhpcmxsbnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjg3MTMsImV4cCI6MjA5MzcwNDcxM30.fCx-_BXJ1nRb69dJdI1EAhP74mghFNoKoLiKdMYxvQ0'
)

export async function resetDb() {
  // matches → seniors → jobs 순서로 삭제 (FK 의존 관계)
  await supabase.from('matches').delete().not('senior_id', 'is', null)
  await supabase.from('seniors').delete().not('id', 'is', null)
  await supabase.from('jobs').delete().not('id', 'is', null)
}

export async function insertJob(job: {
  title: string
  region: string
  job_type: string
  required_career: number
}): Promise<string> {
  const { data, error } = await supabase.from('jobs').insert(job).select('id').single()
  if (error) throw new Error(`insertJob 실패: ${error.message}`)
  return data.id as string
}

export async function countSeniors(): Promise<number> {
  const { count, error } = await supabase
    .from('seniors')
    .select('*', { count: 'exact', head: true })
  if (error) throw new Error(`countSeniors 실패: ${error.message}`)
  return count ?? 0
}
