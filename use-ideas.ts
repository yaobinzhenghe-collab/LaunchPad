import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type GenerateIdeaResponse = z.infer<typeof api.ideas.generate.responses[200]>;

export function useGenerateIdea() {
  return useMutation({
    mutationFn: async (prompt?: string) => {
      const res = await fetch(api.ideas.generate.path, {
        method: api.ideas.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to generate idea");
      }
      
      return api.ideas.generate.responses[200].parse(await res.json());
    },
  });
}
