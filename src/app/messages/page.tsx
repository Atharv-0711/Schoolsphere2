import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Plus, Search } from "lucide-react";
import Link from "next/link";

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get all messages for the current user
  const { data: receivedMessages } = await supabase
    .from("messages")
    .select("*, sender:sender_id(id, full_name, email, user_role)")
    .eq("recipient_id", user.id)
    .is("parent_message_id", null)
    .order("created_at", { ascending: false });

  const { data: sentMessages } = await supabase
    .from("messages")
    .select("*, recipient:recipient_id(id, full_name, email, user_role)")
    .eq("sender_id", user.id)
    .is("parent_message_id", null)
    .order("created_at", { ascending: false });

  // Get unread message count
  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .eq("recipient_id", user.id)
    .eq("read", false);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 py-8 pt-24">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>
            <Link href="/messages/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <Tabs defaultValue="inbox" className="w-full">
                <TabsList>
                  <TabsTrigger value="inbox" className="relative">
                    Inbox
                    {unreadCount && unreadCount > 0 ? (
                      <Badge
                        variant="destructive"
                        className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                      >
                        {unreadCount}
                      </Badge>
                    ) : null}
                  </TabsTrigger>
                  <TabsTrigger value="sent">Sent</TabsTrigger>
                </TabsList>

                <div className="mt-4 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    className="pl-8"
                  />
                </div>

                <TabsContent value="inbox" className="mt-4">
                  <div className="space-y-4">
                    {receivedMessages && receivedMessages.length > 0 ? (
                      receivedMessages.map((message) => (
                        <Link
                          key={message.id}
                          href={`/messages/${message.id}`}
                          className="block"
                        >
                          <Card
                            className={`cursor-pointer hover:bg-accent/50 transition-colors ${!message.read ? "border-primary" : ""}`}
                          >
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">
                                    {message.subject}
                                  </CardTitle>
                                  <CardDescription>
                                    From:{" "}
                                    {message.sender?.full_name ||
                                      message.sender?.email ||
                                      "Unknown"}
                                    {!message.read && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-2"
                                      >
                                        New
                                      </Badge>
                                    )}
                                  </CardDescription>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {message.created_at
                                    ? formatDate(message.created_at)
                                    : ""}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {message.content}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No messages in your inbox
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="sent" className="mt-4">
                  <div className="space-y-4">
                    {sentMessages && sentMessages.length > 0 ? (
                      sentMessages.map((message) => (
                        <Link
                          key={message.id}
                          href={`/messages/${message.id}`}
                          className="block"
                        >
                          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">
                                    {message.subject}
                                  </CardTitle>
                                  <CardDescription>
                                    To:{" "}
                                    {message.recipient?.full_name ||
                                      message.recipient?.email ||
                                      "Unknown"}
                                  </CardDescription>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {message.created_at
                                    ? formatDate(message.created_at)
                                    : ""}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {message.content}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No sent messages
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}
