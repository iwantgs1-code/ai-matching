import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "상상우리 시니어 매칭",
  description: "시니어와 일자리를 자동으로 연결해 드립니다",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geist.className} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-blue-700">
              상상우리
            </Link>
            <Link
              href="/register"
              className="text-lg font-semibold text-gray-700 hover:text-blue-700 transition-colors"
            >
              프로필 등록
            </Link>
            <Link
              href="/recommendations"
              className="text-lg font-semibold text-gray-700 hover:text-blue-700 transition-colors"
            >
              추천 매칭
            </Link>
            <Link
              href="/admin"
              className="text-lg font-semibold text-gray-700 hover:text-blue-700 transition-colors"
            >
              담당자 대시보드
            </Link>
          </nav>
        </header>
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
          {children}
        </main>
        <footer className="text-center text-base text-gray-500 py-6 border-t border-gray-200">
          © 2026 상상우리. 모든 시니어의 새 출발을 응원합니다.
        </footer>
      </body>
    </html>
  );
}
