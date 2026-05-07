import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobManager } from "@/components/job-manager";

const COLUMNS = [
  {
    label: "미매칭",
    color: "bg-red-100 border-red-300",
    badgeClass: "bg-red-600 text-white",
    items: ["김철수 (경비)", "박순자 (요양보조)"],
  },
  {
    label: "매칭 대기",
    color: "bg-yellow-100 border-yellow-300",
    badgeClass: "bg-yellow-600 text-white",
    items: ["홍길동 → 아파트 경비원", "이영희 → 환경미화원"],
  },
  {
    label: "배정 완료",
    color: "bg-green-100 border-green-300",
    badgeClass: "bg-green-700 text-white",
    items: ["최정수 → 요양보호사"],
  },
];

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-12">

      {/* 일자리 관리 섹션 */}
      <section>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">일자리 관리</h1>
        <p className="text-xl text-gray-600 mb-8">
          일자리를 등록하고 관리합니다
        </p>
        <JobManager />
      </section>

      {/* 매칭 현황 섹션 */}
      <section>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">매칭 현황</h2>
        <p className="text-xl text-gray-600 mb-8">
          매칭 단계별 현황입니다 (다음 단계에서 실데이터 연동)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <Card key={col.label} className={`border-2 ${col.color}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl">{col.label}</CardTitle>
                  <Badge className={`text-base px-3 py-1 ${col.badgeClass}`}>
                    {col.items.length}건
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-lg text-gray-800"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-center text-gray-400 text-lg">
          ※ 위 매칭 현황은 UI 확인용 샘플 데이터입니다
        </p>
      </section>
    </div>
  );
}
