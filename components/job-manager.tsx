'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const REGIONS = ['서울', '경기', '인천', '기타']
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타']

type Job = { id: string; title: string; region: string; job_type: string; required_career: number }
type Errors = { title?: string; region?: string; jobType?: string }

// 앱 레이어에서 매칭 점수 계산 (RPC 폴백)
async function computeMatchesFallback(jobId: string) {
  const [{ data: job }, { data: seniors }] = await Promise.all([
    supabase.from('jobs').select('*').eq('id', jobId).single(),
    supabase.from('seniors').select('*'),
  ])
  if (!job || !seniors?.length) return

  const rows = seniors.map(senior => {
    let score = 0
    if (senior.region === job.region) score += 3
    if (senior.desired_job === job.job_type) score += 2
    if (senior.career_years >= job.required_career) score += 1
    return { senior_id: senior.id, job_id: jobId, score, status: 'pending' }
  })
  await supabase.from('matches').upsert(rows, { onConflict: 'senior_id,job_id' })
}

export function JobManager() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [title, setTitle] = useState('')
  const [region, setRegion] = useState('')
  const [jobType, setJobType] = useState('')
  const [requiredCareer, setRequiredCareer] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function loadJobs() {
    const { data } = await supabase
      .from('jobs')
      .select('id, title, region, job_type, required_career')
      .order('created_at', { ascending: false })
    if (data) setJobs(data)
  }

  useEffect(() => { loadJobs() }, [])

  function validate(): Errors {
    const e: Errors = {}
    if (!title.trim()) e.title = '공고명을 입력해 주세요'
    if (!region) e.region = '지역을 선택해 주세요'
    if (!jobType) e.jobType = '직종을 선택해 주세요'
    return e
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({ title: title.trim(), region, job_type: jobType, required_career: parseInt(requiredCareer) || 0 })
        .select('id')
        .single()
      if (error) throw error

      const jobId = data.id

      // RPC 호출 → 실패 시 앱 레이어 폴백
      const { error: rpcErr } = await supabase.rpc('match_job', { p_job_id: jobId })
      if (rpcErr) await computeMatchesFallback(jobId)

      setTitle(''); setRegion(''); setJobType(''); setRequiredCareer('')
      await loadJobs()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await supabase.from('jobs').delete().eq('id', id)
      setJobs(prev => prev.filter(j => j.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">일자리 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="job-title" className="text-lg font-semibold">
                공고명 <span className="text-red-600">*</span>
              </Label>
              {errors.title && (
                <Alert className="border-red-400 bg-red-50 py-2">
                  <AlertDescription className="text-red-700 text-base">{errors.title}</AlertDescription>
                </Alert>
              )}
              <Input id="job-title" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="아파트 경비원 모집" className="text-lg py-6 border-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-lg font-semibold">지역 <span className="text-red-600">*</span></Label>
                {errors.region && (
                  <Alert className="border-red-400 bg-red-50 py-2">
                    <AlertDescription className="text-red-700 text-base">{errors.region}</AlertDescription>
                  </Alert>
                )}
                <Select value={region} onValueChange={val => setRegion(val ?? '')}>
                  <SelectTrigger className="text-lg py-6 border-2"><SelectValue placeholder="지역" /></SelectTrigger>
                  <SelectContent>
                    {REGIONS.map(r => <SelectItem key={r} value={r} className="text-lg">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-lg font-semibold">직종 <span className="text-red-600">*</span></Label>
                {errors.jobType && (
                  <Alert className="border-red-400 bg-red-50 py-2">
                    <AlertDescription className="text-red-700 text-base">{errors.jobType}</AlertDescription>
                  </Alert>
                )}
                <Select value={jobType} onValueChange={val => setJobType(val ?? '')}>
                  <SelectTrigger className="text-lg py-6 border-2"><SelectValue placeholder="직종" /></SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map(j => <SelectItem key={j} value={j} className="text-lg">{j}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="req-career" className="text-lg font-semibold">요구 경력 (년)</Label>
                <Input id="req-career" type="number" min="0" value={requiredCareer}
                  onChange={e => setRequiredCareer(e.target.value)}
                  placeholder="0" className="text-lg py-6 border-2" />
              </div>
            </div>

            <Button type="submit" disabled={submitting}
              className="bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold py-5 self-start px-8">
              {submitting ? '추가 중...' : '일자리 추가'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">
            등록된 일자리 <span className="text-gray-500 text-lg font-normal">({jobs.length}건)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-gray-500 text-lg text-center py-6">등록된 일자리가 없습니다</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-lg font-bold text-gray-900">공고명</TableHead>
                  <TableHead className="text-lg font-bold text-gray-900">지역</TableHead>
                  <TableHead className="text-lg font-bold text-gray-900">직종</TableHead>
                  <TableHead className="text-lg font-bold text-gray-900">요구 경력</TableHead>
                  <TableHead className="text-lg font-bold text-gray-900"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map(job => (
                  <TableRow key={job.id}>
                    <TableCell className="text-lg">{job.title}</TableCell>
                    <TableCell className="text-lg">{job.region}</TableCell>
                    <TableCell className="text-lg">{job.job_type}</TableCell>
                    <TableCell className="text-lg">{job.required_career}년</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm"
                        disabled={deletingId === job.id}
                        onClick={() => handleDelete(job.id)}
                        className="text-base font-bold px-4 py-2">
                        {deletingId === job.id ? '삭제 중...' : '삭제'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
