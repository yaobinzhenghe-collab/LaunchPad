import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useTips(category?: string) {
  return useQuery({
    queryKey: [api.tips.list.path, category],
    queryFn: async () => {
      const url = buildUrl(api.tips.list.path);
      const queryParams = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      const res = await fetch(url + queryParams, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tips");
      return api.tips.list.responses[200].parse(await res.json());
    },
  });
}
