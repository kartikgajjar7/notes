"use client";
import { supabase } from "@/lib/supabase";
import { useChat } from "ai/react";
import { useSupabaseUser } from "@/hooks/useUser";
import { useGetUser } from "@/supabase/auth/client";
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
import { Avatar } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Chat() {
  const user = useSupabaseUser();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        userId: user?.id, // 👈 pass user ID here
      },
    });

  if (!user) return <p>Loading user...</p>;

  return (
    <Card className="w-full border shadow-lg">
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] p-4">
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
                    <Avatar className="h-8 w-8 bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
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
                    <Avatar className="h-8 w-8 bg-primary">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
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
