'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

const REGIONS = ['서울', '경기', '인천', '기타']
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타']

type Errors = { name?: string; region?: string; desiredJob?: string }

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [desiredJob, setDesiredJob] = useState('')
  const [careerYears, setCareerYears] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function validate(): Errors {
    const e: Errors = {}
    if (!name.trim()) e.name = '이름을 입력해 주세요'
    if (!region) e.region = '지역을 선택해 주세요'
    if (!desiredJob) e.desiredJob = '희망 직종을 선택해 주세요'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(false)
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setErrors({})
    setSubmitting(true)
    try {
      const { error } = await supabase.from('seniors').insert({
        name: name.trim(),
        region,
        desired_job: desiredJob,
        career_years: parseInt(careerYears) || 0,
      })
      if (error) throw error
      setSuccess(true)
      setName(''); setRegion(''); setDesiredJob(''); setCareerYears('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">프로필 등록</h1>
      <p className="text-xl text-gray-600 mb-8">
        아래 정보를 입력하시면 맞춤 일자리를 추천해 드립니다
      </p>

      {success && (
        <Alert className="mb-6 border-2 border-green-500 bg-green-50">
          <AlertDescription className="text-green-800 text-lg font-semibold">
            등록이 완료되었습니다
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">시니어 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

            {/* 이름 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-lg font-semibold">
                이름 <span className="text-red-600">*</span>
              </Label>
              {errors.name && (
                <Alert className="border-red-400 bg-red-50 py-2">
                  <AlertDescription className="text-red-700 text-base">{errors.name}</AlertDescription>
                </Alert>
              )}
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="홍길동"
                className="text-lg py-6 border-2"
              />
            </div>

            {/* 지역 */}
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-semibold">
                지역 <span className="text-red-600">*</span>
              </Label>
              {errors.region && (
                <Alert className="border-red-400 bg-red-50 py-2">
                  <AlertDescription className="text-red-700 text-base">{errors.region}</AlertDescription>
                </Alert>
              )}
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="text-lg py-6 border-2">
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(r => (
                    <SelectItem key={r} value={r} className="text-lg">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 희망 직종 */}
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-semibold">
                희망 직종 <span className="text-red-600">*</span>
              </Label>
              {errors.desiredJob && (
                <Alert className="border-red-400 bg-red-50 py-2">
                  <AlertDescription className="text-red-700 text-base">{errors.desiredJob}</AlertDescription>
                </Alert>
              )}
              <Select value={desiredJob} onValueChange={setDesiredJob}>
                <SelectTrigger className="text-lg py-6 border-2">
                  <SelectValue placeholder="직종 선택" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map(j => (
                    <SelectItem key={j} value={j} className="text-lg">{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 경력 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="career" className="text-lg font-semibold">
                경력 (년)
              </Label>
              <Input
                id="career"
                type="number"
                min="0"
                value={careerYears}
                onChange={e => setCareerYears(e.target.value)}
                placeholder="0"
                className="text-lg py-6 border-2"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xl font-bold py-6 mt-2"
            >
              {submitting ? '등록 중...' : '등록하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
