const REGION_MAP: Record<string, string> = {
  '서울특별시': '서울',
  '경기도':     '경기',
  '인천광역시': '인천',
}

const JOB_TYPE_MAP: Record<string, string> = {
  '경비직': '경비',
  '청소직': '청소',
  '조리직': '조리',
  '돌봄직': '돌봄',
}

export function normalizeRegion(r: string): string {
  return REGION_MAP[r] ?? r
}

export function normalizeJobType(j: string): string {
  return JOB_TYPE_MAP[j] ?? j
}
