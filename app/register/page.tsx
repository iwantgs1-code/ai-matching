'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { normalizeRegion, normalizeJobType } from '@/lib/normalize'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mic } from 'lucide-react'

const REGIONS = ['서울', '경기', '인천', '기타']
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타']

type Errors = { name?: string; region?: string; desiredJob?: string }

// 앱 레이어에서 매칭 점수 계산 (RPC 폴백)
async function computeMatchesFallback(seniorId: string) {
  const [{ data: senior }, { data: jobs }] = await Promise.all([
    supabase.from('seniors').select('*').eq('id', seniorId).single(),
    supabase.from('jobs').select('*'),
  ])
  if (!senior || !jobs?.length) return

  const rows = jobs.map(job => {
    let score = 0
    if (normalizeRegion(senior.region) === normalizeRegion(job.region)) score += 3
    if (normalizeJobType(senior.desired_job) === normalizeJobType(job.job_type)) score += 2
    if (senior.career_years >= job.required_career) score += 1
    return { senior_id: seniorId, job_id: job.id, score, status: 'pending' }
  })
  await supabase.from('matches').upsert(rows, { onConflict: 'senior_id,job_id' })
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [desiredJob, setDesiredJob] = useState('')
  const [careerYears, setCareerYears] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      window.speechSynthesis.speak(utterance);
    }
  }

  function validate(): Errors {
    const e: Errors = {}
    if (!name.trim()) e.name = '이름을 입력해 주세요'
    if (!region) e.region = '지역을 선택해 주세요'
    if (!desiredJob) e.desiredJob = '희망 직종을 선택해 주세요'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('seniors')
        .insert({ name: name.trim(), region, desired_job: desiredJob, career_years: parseInt(careerYears) || 0 })
        .select('id')
        .single()
      if (error) throw error

      const seniorId = data.id

      // RPC 호출 → 실패 시 앱 레이어 폴백
      const { error: rpcErr } = await supabase.rpc('match_senior', { p_senior_id: seniorId })
      if (rpcErr) await computeMatchesFallback(seniorId)

      router.push(`/recommendations?senior_id=${seniorId}&registered=true`)
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">시니어 일자리 신청하기</h1>
      <p className="text-xl text-gray-600 mb-8">
        아래 내용을 채우시면 담당자가 맞는 일자리를 찾아드립니다
      </p>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">신청 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-lg font-semibold flex items-center gap-2">
                이름 <span className="text-red-600">*</span>
                <button type="button" onClick={() => speak('이름을 적어 주세요')} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full transition-colors" aria-label="음성 안내 듣기">
                  <Mic size={20} />
                </button>
              </Label>
              <p className="text-base text-gray-500">이름이 어떻게 되세요?</p>
              {errors.name && (
                <Alert className="border-red-400 bg-red-50 py-2">
                  <AlertDescription className="text-red-700 text-base">{errors.name}</AlertDescription>
                </Alert>
              )}
              <Input id="name" value={name} onChange={e => setName(e.target.value)}
                placeholder="홍길동" className="text-lg py-6 border-2" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-lg font-semibold flex items-center gap-2">
                지역 <span className="text-red-600">*</span>
                <button type="button" onClick={() => speak('어디서 일하고 싶으신지 선택해 주세요')} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full transition-colors" aria-label="음성 안내 듣기">
                  <Mic size={20} />
                </button>
              </Label>
              <p className="text-base text-gray-500">어디에서 일하고 싶으세요?</p>
              {errors.region && (
                <Alert className="border-red-400 bg-red-50 py-2">
                  <AlertDescription className="text-red-700 text-base">{errors.region}</AlertDescription>
                </Alert>
              )}
              <Select value={region} onValueChange={val => setRegion(val ?? '')}>
                <SelectTrigger className="text-lg py-6 border-2">
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(r => <SelectItem key={r} value={r} className="text-lg">{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-lg font-semibold flex items-center gap-2">
                희망 직종 <span className="text-red-600">*</span>
                <button type="button" onClick={() => speak('어떤일을 하시고 싶은지 선택해 주세요')} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full transition-colors" aria-label="음성 안내 듣기">
                  <Mic size={20} />
                </button>
              </Label>
              <p className="text-base text-gray-500">어떤 일을 하시고 싶으세요?</p>
              {errors.desiredJob && (
                <Alert className="border-red-400 bg-red-50 py-2">
                  <AlertDescription className="text-red-700 text-base">{errors.desiredJob}</AlertDescription>
                </Alert>
              )}
              <Select value={desiredJob} onValueChange={val => setDesiredJob(val ?? '')}>
                <SelectTrigger className="text-lg py-6 border-2">
                  <SelectValue placeholder="직종 선택" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map(j => <SelectItem key={j} value={j} className="text-lg">{j}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="career" className="text-lg font-semibold flex items-center gap-2">
                경력 (년)
                <button type="button" onClick={() => speak('일하신 경험이 얼마나 되신지 년수로 적어주세요')} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full transition-colors" aria-label="음성 안내 듣기">
                  <Mic size={20} />
                </button>
              </Label>
              <p className="text-base text-gray-500">일하신 경험이 얼마나 되세요? (없으시면 0)</p>
              <Input id="career" type="number" min="0" value={careerYears}
                onChange={e => setCareerYears(e.target.value)}
                placeholder="0" className="text-lg py-6 border-2" />
            </div>

            <Button type="submit" disabled={submitting}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xl font-bold py-6 mt-2">
              {submitting ? '등록 중...' : '등록하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
