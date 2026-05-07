import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-10 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          시니어 일자리 자동 매칭
        </h1>
        <p className="text-xl text-gray-600">
          경력과 지역에 맞는 일자리를 자동으로 찾아드립니다
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        <Card className="border-2 hover:border-blue-400 transition-colors">
          <CardHeader>
            <CardTitle className="text-xl">① 프로필 등록</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-gray-600 text-lg">
              이름, 지역, 희망 직종, 경력을 입력하세요
            </p>
            <Link
              href="/register"
              className="block text-center bg-blue-700 text-white text-lg font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors"
            >
              등록하러 가기
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-blue-400 transition-colors">
          <CardHeader>
            <CardTitle className="text-xl">② 추천 매칭 확인</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-gray-600 text-lg">
              나에게 맞는 일자리 추천 목록을 확인하세요
            </p>
            <Link
              href="/recommendations"
              className="block text-center bg-blue-700 text-white text-lg font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors"
            >
              추천 보기
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-blue-400 transition-colors">
          <CardHeader>
            <CardTitle className="text-xl">③ 담당자 대시보드</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-gray-600 text-lg">
              매칭 현황을 한눈에 확인하고 관리하세요
            </p>
            <Link
              href="/admin"
              className="block text-center bg-gray-700 text-white text-lg font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              대시보드 열기
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
