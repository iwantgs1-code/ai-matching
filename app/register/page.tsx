import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">프로필 등록</h1>
      <p className="text-xl text-gray-600 mb-8">
        아래 정보를 입력하시면 맞춤 일자리를 추천해 드립니다
      </p>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">시니어 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-lg font-semibold">
                이름
              </label>
              <input
                id="name"
                type="text"
                placeholder="홍길동"
                disabled
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="region" className="text-lg font-semibold">
                지역
              </label>
              <input
                id="region"
                type="text"
                placeholder="서울 강남구"
                disabled
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="desired_job" className="text-lg font-semibold">
                희망 직종
              </label>
              <input
                id="desired_job"
                type="text"
                placeholder="경비, 청소, 요양보호 등"
                disabled
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="career_years" className="text-lg font-semibold">
                경력 (년)
              </label>
              <input
                id="career_years"
                type="number"
                placeholder="0"
                min="0"
                disabled
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled
              className="bg-blue-700 text-white text-xl font-bold py-4 px-8 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              등록하기 (다음 단계에서 활성화)
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
