"use client";
import { supabase } from "@/lib/supabase";
import { useChat } from "ai/react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useUser";
import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Chat() {
  const user = useSupabaseUser();
  console.log(user);
  const storageKey = "chat_messages"; // Define a storage key for localStorage
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        userId: user?.id,
      },
      initialMessages:
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem(storageKey) || "[]")
          : [], // 👈 लोकल स्टोरेज से इनिशियल मैसेजेस
    });
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, user?.id, storageKey]);

  if (!user) return <p>Loading user...</p>;

  return (
    <Card className="w-full border shadow-lg">
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] p-4 ">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-muted-foreground">
                Send a message to start the conversation.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full items-start gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role !== "user" && (
                    <Avatar>
                      <AvatarImage src="/IMG_4307.PNG" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 max-w-[80%]",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarImage src={user?.user_metadata.avatar_url} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="/IMG_4307.PNG" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-muted px-4 py-2 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-75" />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
