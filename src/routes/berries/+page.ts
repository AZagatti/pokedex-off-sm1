import { getBerryList } from "$lib/api/client";

import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
  const list = await getBerryList(100, 0, fetch);
  return { berries: list.results };
};
