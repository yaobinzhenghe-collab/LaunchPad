import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MessageCircle, Send, Loader2, Plus, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateConversation, useConversations, useChatMessages, useSendChatMessage } from "@/hooks/use-chat";
import type { ChatConversation, ChatMessage } from "@shared/schema";

const VISITOR_ID_KEY = "edithive_visitor_id";

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

const newConversationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type NewConversationForm = z.infer<typeof newConversationSchema>;

function ConversationList({ 
  conversations, 
  onSelect, 
  onNewChat,
  selectedId 
}: { 
  conversations: ChatConversation[];
  onSelect: (conv: ChatConversation) => void;
  onNewChat: () => void;
  selectedId?: number;
}) {
  return (
    <div className="space-y-2">
      <Button 
        onClick={onNewChat} 
        className="w-full mb-4"
        data-testid="button-new-chat"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Conversation
      </Button>
      
      {conversations.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No conversations yet. Start one!
        </p>
      ) : (
        conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            data-testid={`conversation-item-${conv.id}`}
            className={`w-full text-left p-4 rounded-xl border transition-colors ${
              selectedId === conv.id 
                ? "bg-primary/20 border-primary" 
                : "bg-card border-white/10 hover-elevate"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white truncate">{conv.subject}</span>
              {conv.status === "closed" && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded">Closed</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(conv.lastMessageAt).toLocaleDateString()}
            </p>
          </button>
        ))
      )}
    </div>
  );
}

function ChatView({ conversation, onBack }: { conversation: ChatConversation; onBack: () => void }) {
  const { data: messages = [], isLoading } = useChatMessages(conversation.id);
  const sendMessage = useSendChatMessage(conversation.id);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage.mutate({ content: newMessage.trim() }, {
      onSuccess: () => setNewMessage(""),
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          data-testid="button-back-to-list"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h3 className="font-semibold text-white">{conversation.subject}</h3>
          <p className="text-xs text-muted-foreground">
            {conversation.status === "open" ? "Active" : "Closed"}
          </p>
        </div>
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
              data-testid={`message-${msg.id}`}
              className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.isAdmin
                    ? "bg-primary/20 text-white"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {msg.isAdmin && (
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-medium text-primary">Edit Hive</span>
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {conversation.status === "open" && (
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-background border-white/10"
              data-testid="input-chat-message"
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
              data-testid="button-send-message"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewConversationForm({ onSuccess }: { onSuccess: (conv: ChatConversation) => void }) {
  const createConversation = useCreateConversation();
  const sendMessage = useSendChatMessage(0);
  const [createdConv, setCreatedConv] = useState<ChatConversation | null>(null);

  const form = useForm<NewConversationForm>({
    resolver: zodResolver(newConversationSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: NewConversationForm) => {
    const visitorId = getVisitorId();
    
    createConversation.mutate({
      visitorId,
      visitorName: data.name,
      visitorEmail: data.email || undefined,
      subject: data.subject,
    }, {
      onSuccess: async (conv) => {
        setCreatedConv(conv);
        const res = await fetch(`/api/chat/conversations/${conv.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: data.message }),
          credentials: 'include',
        });
        if (res.ok) {
          onSuccess(conv);
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Your Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your name" 
                  {...field}
                  className="bg-background border-white/10 focus:border-primary h-11 rounded-xl"
                  data-testid="input-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email (optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
                  {...field}
                  className="bg-background border-white/10 focus:border-primary h-11 rounded-xl"
                  data-testid="input-email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Subject</FormLabel>
              <FormControl>
                <Input 
                  placeholder="What's this about?" 
                  {...field}
                  className="bg-background border-white/10 focus:border-primary h-11 rounded-xl"
                  data-testid="input-subject"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Your Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your idea, suggestion, or question..." 
                  {...field}
                  className="bg-background border-white/10 focus:border-primary min-h-[100px] rounded-xl resize-none"
                  data-testid="input-message"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createConversation.isPending}
          className="w-full h-11 rounded-xl"
          data-testid="button-start-chat"
        >
          {createConversation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Starting Chat...
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chat
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default function Contact() {
  const visitorId = getVisitorId();
  const { data: conversations = [], isLoading } = useConversations(visitorId);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);

  const handleNewChatSuccess = (conv: ChatConversation) => {
    setShowNewChat(false);
    setSelectedConversation(conv);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary mb-6">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Let's Chat
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Have an idea for a template? Want to suggest a tutorial? Just want to say hi? 
            Start a conversation and I'll get back to you!
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Usually responds within 24 hours</span>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Private back-and-forth conversation</span>
            </div>
          </div>

          <div className="bg-card border border-white/10 rounded-2xl p-4">
            <h3 className="font-semibold text-white mb-4">Your Conversations</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                onSelect={(conv) => {
                  setSelectedConversation(conv);
                  setShowNewChat(false);
                }}
                onNewChat={() => {
                  setSelectedConversation(null);
                  setShowNewChat(true);
                }}
                selectedId={selectedConversation?.id}
              />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-white/10 rounded-3xl overflow-hidden min-h-[600px] flex flex-col"
        >
          {selectedConversation ? (
            <ChatView 
              conversation={selectedConversation} 
              onBack={() => setSelectedConversation(null)}
            />
          ) : showNewChat || conversations.length === 0 ? (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Start a New Conversation</h2>
              <NewConversationForm onSuccess={handleNewChatSuccess} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a conversation or start a new one</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
