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

function RecommendationsList() {
  const searchParams = useSearchParams()
  const seniorId = searchParams.get('senior_id')
  const [matches, setMatches] = useState<MatchWithJob[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!seniorId) return
    setLoading(true)
    supabase
      .from('matches')
      .select('id, score, status, jobs(title, region, job_type)')
      .eq('senior_id', seniorId)
      .gt('score', 0)
      .order('score', { ascending: false })
      .then(({ data }) => {
        setMatches((data as unknown as MatchWithJob[]) ?? [])
        setLoading(false)
      })
  }, [seniorId])

  if (!seniorId) {
    return (
      <Alert className="border-2 border-blue-200 bg-blue-50">
        <AlertDescription className="text-lg text-blue-800">
          프로필 등록 후 자동으로 이 페이지로 이동됩니다.
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return <p className="text-xl text-gray-500 text-center py-12">매칭 결과를 불러오는 중...</p>
  }

  if (matches.length === 0) {
    return (
      <Alert className="border-2 border-gray-300 bg-gray-50">
        <AlertDescription className="text-xl text-gray-600 font-semibold">
          현재 매칭되는 일자리가 없습니다
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {matches.map((match) => (
        <Card key={match.id} className="border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{match.jobs?.title}</CardTitle>
              <Badge className={`text-lg px-4 py-2 ${scoreBadgeClass(match.score)}`}>
                {match.score}점
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
  )
}

export default function RecommendationsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">자동 매칭 추천 목록</h1>
      <p className="text-xl text-gray-600 mb-8">매칭 점수 높은 순으로 표시됩니다</p>
      <Suspense fallback={<p className="text-xl text-gray-500">불러오는 중...</p>}>
        <RecommendationsList />
      </Suspense>
    </div>
  )
}
