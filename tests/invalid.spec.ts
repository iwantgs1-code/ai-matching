import { test, expect } from '@playwright/test'
import { resetDb, countSeniors } from './helpers/db'

test.beforeEach(async () => {
  await resetDb()
})

test('실패: 이름 빈칸 제출 시 빨간 안내 박스 표시 및 DB 미저장', async ({ page }) => {
  await page.goto('/register')

  // 이름 입력하지 않음
  await page.getByRole('combobox').nth(0).click()
  await page.getByRole('option', { name: '서울' }).click()

  await page.getByRole('combobox').nth(1).click()
  await page.getByRole('option', { name: '경비' }).click()

  await page.fill('#career', '3')

  await page.getByRole('button', { name: '등록하기' }).click()

  // 이름 필드 위 빨간 안내 박스 표시 확인
  const errorAlert = page.locator('.bg-red-50')
  await expect(errorAlert).toBeVisible()
  await expect(errorAlert).toContainText('이름을 입력해 주세요')

  // 페이지 이동 없음 확인
  await expect(page).toHaveURL('/register')

  // seniors 테이블에 새 레코드가 없음을 확인
  const count = await countSeniors()
  expect(count).toBe(0)
})
