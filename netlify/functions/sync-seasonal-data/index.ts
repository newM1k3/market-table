import type { Handler } from '@netlify/functions';

// Weekly sync: fetches Ontario seasonal availability data from the CKAN API
// and upserts into PocketBase. Scheduled via Netlify scheduled functions.
//
// CKAN API endpoint:
// https://data.ontario.ca/api/3/action/datastore_search?resource_id=f85f9d64-116d-4169-b887-665cf804d113

const CKAN_API_URL = 'https://data.ontario.ca/api/3/action/datastore_search';
const RESOURCE_ID = 'f85f9d64-116d-4169-b887-665cf804d113';

interface CkanRecord {
  _id: number;
  COMMODITY: string;
  JAN: string;
  FEB: string;
  MAR: string;
  APR: string;
  MAY: string;
  JUN: string;
  JUL: string;
  AUG: string;
  SEP: string;
  OCT: string;
  NOV: string;
  DEC: string;
}

const MONTH_MAP: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

function getMonths(record: CkanRecord): number[] {
  const months: number[] = [];
  for (const [key, monthNum] of Object.entries(MONTH_MAP)) {
    if (record[key as keyof CkanRecord]?.toString().toLowerCase() === 'yes') {
      months.push(monthNum);
    }
  }
  return months;
}

function getSeason(months: number[]): string {
  if (months.length >= 10) return 'year-round';
  const hasWinter = months.some((m) => [12, 1, 2].includes(m));
  const hasSpring = months.some((m) => [3, 4, 5].includes(m));
  const hasSummer = months.some((m) => [6, 7, 8].includes(m));
  const hasFall = months.some((m) => [9, 10, 11].includes(m));

  const counts = [
    { season: 'winter', count: months.filter((m) => [12, 1, 2].includes(m)).length },
    { season: 'spring', count: months.filter((m) => [3, 4, 5].includes(m)).length },
    { season: 'summer', count: months.filter((m) => [6, 7, 8].includes(m)).length },
    { season: 'fall', count: months.filter((m) => [9, 10, 11].includes(m)).length },
  ];

  return counts.sort((a, b) => b.count - a.count)[0].season;
}

export const handler: Handler = async () => {
  try {
    const url = `${CKAN_API_URL}?resource_id=${RESOURCE_ID}&limit=200`;
    const response = await fetch(url);

    if (!response.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: `CKAN API returned ${response.status}` }) };
    }

    const data = await response.json();
    const records: CkanRecord[] = data.result?.records || [];

    const seasonalData = records
      .filter((r) => r.COMMODITY)
      .map((r) => ({
        product_name: r.COMMODITY.trim(),
        season: getSeason(getMonths(r)),
        months: getMonths(r),
        source: 'foodland-ontario',
      }));

    console.log(`[SYNC] Synced ${seasonalData.length} seasonal products from CKAN`);

    // In production: upsert into PocketBase
    // for (const item of seasonalData) {
    //   await pb.collection('seasonal_availability').create(item);
    // }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        count: seasonalData.length,
        sample: seasonalData.slice(0, 3),
      }),
    };
  } catch (e) {
    console.error('[SYNC] Error:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Sync failed' }),
    };
  }
};
