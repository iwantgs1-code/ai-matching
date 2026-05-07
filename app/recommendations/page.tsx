import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PLACEHOLDER_MATCHES = [
  { rank: 1, seniorName: "홍길동", jobTitle: "아파트 경비원", region: "서울 강남구", score: 92 },
  { rank: 2, seniorName: "김철수", jobTitle: "요양보호사 보조", region: "부산 해운대구", score: 85 },
  { rank: 3, seniorName: "이영희", jobTitle: "환경미화원", region: "대전 유성구", score: 78 },
];

export default function RecommendationsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">자동 매칭 추천 목록</h1>
      <p className="text-xl text-gray-600 mb-8">
        매칭 점수 높은 순으로 표시됩니다 (기능 구현 예정)
      </p>

      <div className="flex flex-col gap-4">
        {PLACEHOLDER_MATCHES.map((item) => (
          <Card key={item.rank} className="border-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {item.rank}위. {item.seniorName} → {item.jobTitle}
                </CardTitle>
                <Badge className="text-lg px-4 py-2 bg-blue-700 text-white">
                  {item.score}점
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-600">지역: {item.region}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-gray-400 text-lg">
        ※ 위 목록은 UI 확인용 샘플 데이터입니다. 실제 매칭은 다음 단계에서 구현됩니다.
      </p>
    </div>
  );
}
