import { test, expect } from '@playwright/test'
import { resetDb, insertJob } from './helpers/db'

test.beforeEach(async () => {
  await resetDb()
  // 절대 매칭 안 되는 공고: 기타/기타/0
  // 서울/경비/3 시니어와 점수 계산: 지역 0 + 직종 0 + 경력(3≥0→1) = 1점
  // recommendations 페이지 필터가 score≥2 이므로 표시되지 않음
  await insertJob({ title: '기타 직종', region: '기타', job_type: '기타', required_career: 0 })
})

test('엣지: 매칭 없음 안내 박스 표시', async ({ page }) => {
  await page.goto('/register')

  await page.fill('#name', '테스트시니어노매치')

  await page.getByRole('combobox').nth(0).click()
  await page.getByRole('option', { name: '서울' }).click()

  await page.getByRole('combobox').nth(1).click()
  await page.getByRole('option', { name: '경비' }).click()

  await page.fill('#career', '3')

  await page.getByRole('button', { name: '등록하기' }).click()

  await page.waitForURL(/\/recommendations\?senior_id=/, { timeout: 15_000 })

  await expect(
    page.getByText('현재 매칭되는 일자리가 없습니다')
  ).toBeVisible({ timeout: 10_000 })
})
