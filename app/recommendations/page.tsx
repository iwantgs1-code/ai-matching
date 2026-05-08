'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

type MatchWithJob = {
  id: string
  score: number
  status: string
  jobs: { title: string; region: string; job_type: string } | null
}

function scoreBadgeClass(score: number) {
  if (score >= 6) return 'bg-yellow-500 text-white'
  if (score >= 4) return 'bg-green-600 text-white'
  if (score >= 2) return 'bg-gray-500 text-white'
  return 'bg-gray-200 text-gray-700'
}

function scoreLabel(score: number) {
  if (score >= 6) return '매우 적합'
  if (score >= 4) return '적합'
  return '보통'
}

function RecommendationsList() {
  const searchParams = useSearchParams()
  const seniorId = searchParams.get('senior_id')
  const registered = searchParams.get('registered') === 'true'
  const [seniorName, setSeniorName] = useState('')
  const [matches, setMatches] = useState<MatchWithJob[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!seniorId) return
    setLoading(true)
    Promise.all([
      supabase.from('seniors').select('name').eq('id', seniorId).single(),
      supabase
        .from('matches')
        .select('id, score, status, jobs(title, region, job_type)')
        .eq('senior_id', seniorId)
        .gte('score', 2)
        .order('score', { ascending: false }),
    ]).then(([{ data: seniorData }, { data: matchData }]) => {
      if (seniorData) setSeniorName(seniorData.name)
      setMatches((matchData as unknown as MatchWithJob[]) ?? [])
      setLoading(false)
    })
  }, [seniorId])

  if (!seniorId) {
    return (
      <>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">추천 매칭 목록</h1>
        <p className="text-xl text-gray-600 mb-8">매칭 점수 높은 순으로 표시됩니다</p>
        <Alert className="border-2 border-blue-200 bg-blue-50">
          <AlertDescription className="text-lg text-blue-800">
            프로필 등록 후 자동으로 이 페이지로 이동됩니다.
          </AlertDescription>
        </Alert>
      </>
    )
  }

  const pageTitle = seniorName ? `${seniorName} 님께 맞는 일자리` : '추천 매칭 목록'

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
      <p className="text-xl text-gray-600 mb-8">매칭 점수 높은 순으로 표시됩니다</p>

      {registered && (
        <Alert className="border-green-400 bg-green-50 mb-6">
          <AlertDescription className="text-green-700 text-lg font-semibold">
            등록이 완료되었습니다. 담당자가 곧 연락드립니다
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <p className="text-xl text-gray-500 text-center py-12">매칭 결과를 불러오는 중...</p>
      ) : matches.length === 0 ? (
        <Alert className="border-2 border-gray-300 bg-gray-50">
          <AlertDescription className="text-xl text-gray-700 font-semibold">
            현재 매칭되는 일자리가 없습니다
            <span className="block text-lg text-gray-500 font-normal mt-1">
              담당자가 직접 연락드리니 잠시만 기다려 주세요
            </span>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map((match) => (
            <Card key={match.id} className="border-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-2xl">{match.jobs?.title}</CardTitle>
                  <Badge className={`text-base px-4 py-2 shrink-0 ${scoreBadgeClass(match.score)}`}>
                    {match.score}점 · {scoreLabel(match.score)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <p className="text-lg text-gray-600">지역: {match.jobs?.region}</p>
                <p className="text-lg text-gray-600">직종: {match.jobs?.job_type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

export default function RecommendationsPage() {
  return (
    <div>
      <Suspense fallback={<p className="text-xl text-gray-500">불러오는 중...</p>}>
        <RecommendationsList />
      </Suspense>
    </div>
  )
}
