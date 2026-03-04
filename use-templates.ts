import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useTemplates(category?: string) {
  return useQuery({
    queryKey: [api.templates.list.path, category],
    queryFn: async () => {
      const url = buildUrl(api.templates.list.path);
      const queryParams = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      const res = await fetch(url + queryParams, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch templates");
      return api.templates.list.responses[200].parse(await res.json());
    },
  });
}
