import { test, expect } from '@playwright/test'
import { resetDb, insertJob } from './helpers/db'

test.beforeEach(async () => {
  await resetDb()
  // 서울/경비/경력3년 공고 1건 준비
  await insertJob({ title: '서울 경비원', region: '서울', job_type: '경비', required_career: 3 })
})

test('정상: 프로필 등록 후 6점 금색 배지 카드가 상단 표시', async ({ page }) => {
  await page.goto('/register')

  await page.fill('#name', '테스트시니어')

  // 지역 선택: 서울
  await page.getByRole('combobox').nth(0).click()
  await page.getByRole('option', { name: '서울' }).click()

  // 희망 직종 선택: 경비
  await page.getByRole('combobox').nth(1).click()
  await page.getByRole('option', { name: '경비' }).click()

  await page.fill('#career', '5')

  await page.getByRole('button', { name: '등록하기' }).click()

  // recommendations 페이지로 리다이렉트 대기
  await page.waitForURL(/\/recommendations\?senior_id=.+&registered=true/, { timeout: 15_000 })

  // 등록 완료 초록 배너
  await expect(page.getByText('등록이 완료되었습니다')).toBeVisible()

  // 6점 금색 배지가 첫 번째 카드에 표시
  const goldBadge = page.locator('.bg-yellow-500').first()
  await expect(goldBadge).toBeVisible({ timeout: 10_000 })
  await expect(goldBadge).toContainText('6점')
})
