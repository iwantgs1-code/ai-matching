import { JobManager } from "@/components/job-manager";
import { SeniorDashboard } from "@/components/senior-dashboard";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-14">

      {/* 매칭 현황 대시보드 */}
      <section>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
        <p className="text-xl text-gray-600 mb-8">시니어 매칭 현황을 한눈에 확인합니다</p>
        <SeniorDashboard />
      </section>

      {/* 일자리 관리 */}
      <section>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">일자리 관리</h2>
        <p className="text-xl text-gray-600 mb-8">일자리를 등록하고 관리합니다</p>
        <JobManager />
      </section>

    </div>
  );
}
