import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Inbox, Send, Loader2, ChevronLeft, Check, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useConversations, useChatMessages, useSendChatMessage, useUpdateConversationStatus } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import type { ChatConversation, ChatMessage } from "@shared/schema";
import { Link } from "wouter";

function ConversationList({ 
  conversations, 
  onSelect, 
  selectedId,
  isLoading
}: { 
  conversations: ChatConversation[];
  onSelect: (conv: ChatConversation) => void;
  selectedId?: number;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Inbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv)}
          data-testid={`admin-conversation-${conv.id}`}
          className={`w-full text-left p-4 rounded-xl border transition-colors ${
            selectedId === conv.id 
              ? "bg-primary/20 border-primary" 
              : "bg-card border-white/10 hover-elevate"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-white truncate">{conv.visitorName}</span>
            <Badge variant={conv.status === "open" ? "default" : "secondary"}>
              {conv.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate mb-1">{conv.subject}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{conv.visitorEmail || "No email"}</span>
            <span>{new Date(conv.lastMessageAt).toLocaleDateString()}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function AdminChatView({ 
  conversation, 
  onBack 
}: { 
  conversation: ChatConversation; 
  onBack: () => void;
}) {
  const { data: messages = [], isLoading } = useChatMessages(conversation.id);
  const sendMessage = useSendChatMessage(conversation.id);
  const updateStatus = useUpdateConversationStatus(conversation.id);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage.mutate({ content: newMessage.trim(), isAdmin: true }, {
      onSuccess: () => setNewMessage(""),
    });
  };

  const toggleStatus = () => {
    const newStatus = conversation.status === "open" ? "closed" : "open";
    updateStatus.mutate(newStatus);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            data-testid="button-admin-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{conversation.visitorName}</h3>
              <Badge variant={conversation.status === "open" ? "default" : "secondary"}>
                {conversation.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{conversation.subject}</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleStatus}
          disabled={updateStatus.isPending}
          data-testid="button-toggle-status"
        >
          {updateStatus.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : conversation.status === "open" ? (
            <>
              <X className="w-4 h-4 mr-1" />
              Close
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-1" />
              Reopen
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No messages yet.
          </p>
        ) : (
          messages.map((msg: ChatMessage) => (
            <div
              key={msg.id}
              data-testid={`admin-message-${msg.id}`}
              className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.isAdmin
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {!msg.isAdmin && (
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-medium">{conversation.visitorName}</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.isAdmin ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1 bg-background border-white/10"
            data-testid="input-admin-reply"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button 
            onClick={handleSend} 
            disabled={sendMessage.isPending || !newMessage.trim()}
            data-testid="button-admin-send"
          >
            {sendMessage.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminInbox() {
  const { user, isLoading: userLoading } = useAuth();
  const { data: conversations = [], isLoading } = useConversations();
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <Inbox className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground mb-4">Please log in as an admin to view the inbox.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const openCount = conversations.filter(c => c.status === "open").length;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
              <Inbox className="w-8 h-8 text-primary" />
              Message Inbox
            </h1>
            <p className="text-muted-foreground mt-1">
              {openCount} open conversation{openCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-card border border-white/10 rounded-2xl p-4 h-[calc(100vh-220px)] overflow-y-auto">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              All Conversations
            </h2>
            <ConversationList
              conversations={conversations}
              onSelect={setSelectedConversation}
              selectedId={selectedConversation?.id}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-2 bg-card border border-white/10 rounded-2xl overflow-hidden h-[calc(100vh-220px)] flex flex-col">
            {selectedConversation ? (
              <AdminChatView 
                conversation={selectedConversation} 
                onBack={() => setSelectedConversation(null)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
