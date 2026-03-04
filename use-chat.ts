import { useMutation, useQuery } from "@tanstack/react-query";
import type { InsertChatConversation, ChatConversation, ChatMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export function useCreateConversation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertChatConversation) => {
      const res = await apiRequest('POST', '/api/chat/conversations', data);
      return await res.json() as ChatConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useConversations(visitorId?: string) {
  const queryKey = visitorId 
    ? ['/api/chat/conversations', { visitorId }]
    : ['/api/chat/conversations'];
  
  const url = visitorId 
    ? `/api/chat/conversations?visitorId=${visitorId}`
    : '/api/chat/conversations';

  return useQuery<ChatConversation[]>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch conversations');
      return res.json();
    },
  });
}

export function useConversation(id: number) {
  return useQuery<ChatConversation>({
    queryKey: ['/api/chat/conversations', id],
    queryFn: async () => {
      const res = await fetch(`/api/chat/conversations/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch conversation');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useChatMessages(conversationId: number) {
  return useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/conversations', conversationId, 'messages'],
    queryFn: async () => {
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json();
    },
    enabled: !!conversationId,
    refetchInterval: 5000,
  });
}

export function useSendChatMessage(conversationId: number) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ content, isAdmin = false }: { content: string; isAdmin?: boolean }) => {
      const res = await apiRequest('POST', `/api/chat/conversations/${conversationId}/messages`, { content, isAdmin });
      return await res.json() as ChatMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations', conversationId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateConversationStatus(conversationId: number) {
  return useMutation({
    mutationFn: async (status: 'open' | 'closed') => {
      const res = await apiRequest('PATCH', `/api/chat/conversations/${conversationId}/status`, { status });
      return await res.json() as ChatConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations', conversationId] });
    },
  });
}
