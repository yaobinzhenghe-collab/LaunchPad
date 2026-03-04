import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MessageCircle, Send, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { GlobalChatMessage } from "@shared/schema";

const NICKNAME_KEY = "edithive_chat_nickname";

function getNickname(): string {
  return localStorage.getItem(NICKNAME_KEY) || "";
}

function setNickname(nickname: string) {
  localStorage.setItem(NICKNAME_KEY, nickname);
}

export default function GlobalChat() {
  const [nickname, setNicknameState] = useState(getNickname());
  const [nicknameInput, setNicknameInput] = useState(getNickname());
  const [message, setMessage] = useState("");
  const [hasJoined, setHasJoined] = useState(!!getNickname());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data: messages = [], isLoading } = useQuery<GlobalChatMessage[]>({
    queryKey: ["/api/global-chat"],
    refetchInterval: 1000,
  });

  const sendMessage = useMutation({
    mutationFn: (data: { nickname: string; content: string }) =>
      apiRequest("POST", "/api/global-chat", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/global-chat"] });
      setMessage("");
      setShouldScrollToBottom(true);
    },
  });

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);
  
  useEffect(() => {
    if (!isLoading && messages.length > 0 && isInitialLoad) {
      scrollToBottom();
      setIsInitialLoad(false);
    }
  }, [isLoading, messages, isInitialLoad]);

  const handleJoin = () => {
    if (nicknameInput.trim()) {
      setNickname(nicknameInput.trim());
      setNicknameState(nicknameInput.trim());
      setHasJoined(true);
    }
  };

  const handleSend = () => {
    if (message.trim() && nickname) {
      sendMessage.mutate({ nickname, content: message.trim() });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasJoined) {
        handleSend();
      } else {
        handleJoin();
      }
    }
  };

  const sortedMessages = [...messages].reverse();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2 font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Community Chat
            </h1>
            <p className="text-muted-foreground">
              Chat with fellow creators in real-time
            </p>
          </div>

          <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
            {!hasJoined ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-4">Join the Chat</h2>
                <p className="text-muted-foreground mb-6">
                  Choose a nickname to start chatting with other creators
                </p>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <Input
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Your nickname..."
                    data-testid="input-nickname"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleJoin}
                    disabled={!nicknameInput.trim()}
                    data-testid="button-join-chat"
                  >
                    Join
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-white/10 bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">
                      Chatting as <span className="text-foreground font-medium">{nickname}</span>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      localStorage.removeItem(NICKNAME_KEY);
                      setHasJoined(false);
                      setNicknameState("");
                    }}
                    data-testid="button-change-nickname"
                  >
                    Change
                  </Button>
                </div>

                <div ref={messagesContainerRef} className="h-[400px] overflow-y-auto p-4 space-y-3">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : sortedMessages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Be the first to say hello!</p>
                    </div>
                  ) : (
                    sortedMessages.map((msg) => (
                      <div
                        key={msg.id}
                        data-testid={`chat-message-${msg.id}`}
                        className={`flex gap-3 ${
                          msg.nickname === nickname ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            msg.nickname === nickname
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent text-accent-foreground"
                          }`}
                        >
                          {msg.nickname.charAt(0).toUpperCase()}
                        </div>
                        <div
                          className={`max-w-[70%] ${
                            msg.nickname === nickname ? "text-right" : ""
                          }`}
                        >
                          <div
                            className={`text-xs text-muted-foreground mb-1 ${
                              msg.nickname === nickname ? "text-right" : ""
                            }`}
                          >
                            {msg.nickname}
                          </div>
                          <div
                            className={`inline-block px-4 py-2 rounded-2xl ${
                              msg.nickname === nickname
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-muted rounded-tl-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div
                            className={`text-xs text-muted-foreground mt-1 ${
                              msg.nickname === nickname ? "text-right" : ""
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-white/10 bg-muted/30">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type a message..."
                      data-testid="input-chat-message"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!message.trim() || sendMessage.isPending}
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
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
