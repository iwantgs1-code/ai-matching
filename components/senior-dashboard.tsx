'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

type Senior = {
  id: string
  name: string
  region: string
  desired_job: string
  career_years: number
}

type MatchRow = {
  senior_id: string
  score: number
  status: string
}

type SeniorWithStats = Senior & {
  maxScore: number
  matchStatus: 'unmatched' | 'pending' | 'assigned'
}

function computeStatus(matches: MatchRow[]): 'unmatched' | 'pending' | 'assigned' {
  if (matches.length === 0) return 'unmatched'
  const hasAssigned = matches.some(m => m.status === 'assigned' || m.status === 'done')
  if (hasAssigned) return 'assigned'
  const hasPending = matches.some(m => Number(m.score) > 0 && m.status === 'pending')
  if (hasPending) return 'pending'
  return 'unmatched'
}

const STATUS_LABEL: Record<string, string> = {
  unmatched: '미매칭',
  pending: '매칭 대기',
  assigned: '배정 완료',
}

const STATUS_BADGE: Record<string, string> = {
  unmatched: 'bg-red-100 text-red-700 border border-red-300',
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  assigned: 'bg-green-100 text-green-800 border border-green-400',
}

export function SeniorDashboard() {
  const [seniors, setSeniors] = useState<SeniorWithStats[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const [{ data: seniorData }, { data: matchData }] = await Promise.all([
      supabase.from('seniors').select('id, name, region, desired_job, career_years').order('created_at', { ascending: false }),
      supabase.from('matches').select('senior_id, score, status'),
    ])

    const matchMap: Record<string, MatchRow[]> = {}
    for (const m of matchData ?? []) {
      if (!matchMap[m.senior_id]) matchMap[m.senior_id] = []
      matchMap[m.senior_id].push(m)
    }

    const enriched: SeniorWithStats[] = (seniorData ?? []).map(s => {
      const ms = matchMap[s.id] ?? []
      const maxScore = ms.length ? Math.max(...ms.map(m => Number(m.score))) : 0
      return { ...s, maxScore, matchStatus: computeStatus(ms) }
    })

    setSeniors(enriched)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const unmatched = seniors.filter(s => s.matchStatus === 'unmatched').length
  const pending   = seniors.filter(s => s.matchStatus === 'pending').length
  const assigned  = seniors.filter(s => s.matchStatus === 'assigned').length

  return (
    <div className="flex flex-col gap-8">
      {/* 집계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-2 border-red-300 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-700">미매칭</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-red-700">{unmatched}<span className="text-2xl ml-1">명</span></p>
          </CardContent>
        </Card>
        <Card className="border-2 border-yellow-300 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-yellow-800">매칭 대기</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-yellow-800">{pending}<span className="text-2xl ml-1">명</span></p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-300 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-800">배정 완료</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-green-800">{assigned}<span className="text-2xl ml-1">명</span></p>
          </CardContent>
        </Card>
      </div>

      {/* 시니어 목록 */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">
            시니어 목록 <span className="text-gray-500 text-lg font-normal">({seniors.length}명)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-lg text-gray-500 text-center py-6">불러오는 중...</p>
          ) : seniors.length === 0 ? (
            <p className="text-lg text-gray-500 text-center py-6">등록된 시니어가 없습니다</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-lg font-bold text-gray-900">이름</TableHead>
                  <TableHead className="text-lg font-bold text-gray-900">지역</TableHead>
                  <TableHead className="text-lg font-bold text-gray-900">희망 직종</TableHead>
                  <TableHead className="text-lg font-bold text-gray-900">최고 점수</TableHead>
                  <TableHead className="text-lg font-bold text-gray-900">상태</TableHead>
                  <TableHead className="text-lg font-bold text-gray-900"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seniors.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="text-lg font-semibold">{s.name}</TableCell>
                    <TableCell className="text-lg">{s.region}</TableCell>
                    <TableCell className="text-lg">{s.desired_job}</TableCell>
                    <TableCell className="text-lg font-bold">{s.maxScore}점</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-base font-semibold ${STATUS_BADGE[s.matchStatus]}`}>
                        {STATUS_LABEL[s.matchStatus]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/recommendations?senior_id=${s.id}`}
                        className="bg-blue-700 text-white text-base font-bold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        상세 보기
                      </Link>
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
