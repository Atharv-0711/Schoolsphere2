import { createClient } from "../../../../supabase/server";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, Message } from "@/components/form-message";
import { UrlProvider } from "@/components/url-provider";
import { replyToMessageAction, markMessageAsReadAction } from "@/app/actions";
import { ArrowLeft, Reply } from "lucide-react";
import Link from "next/link";

export default async function MessageDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Promise<Message>;
}) {
  const messageParams = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get the message
  const { data: message } = await supabase
    .from("messages")
    .select(
      "*, sender:sender_id(id, full_name, email, user_role), recipient:recipient_id(id, full_name, email, user_role)",
    )
    .eq("id", params.id)
    .single();

  if (!message) {
    redirect("/messages");
  }

  // Check if user is authorized to view this message
  if (message.sender_id !== user.id && message.recipient_id !== user.id) {
    redirect("/messages");
  }

  // Mark message as read if user is the recipient and message is unread
  if (message.recipient_id === user.id && !message.read) {
    await markMessageAsReadAction(params.id);
  }

  // Get all replies to this message
  const { data: replies } = await supabase
    .from("messages")
    .select("*, sender:sender_id(id, full_name, email, user_role)")
    .eq("parent_message_id", params.id)
    .order("created_at", { ascending: true });

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 py-8 pt-24">
        <div className="w-full max-w-3xl">
          <div className="flex items-center mb-6">
            <Link href="/messages" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              {message.subject}
            </h1>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">
                    {message.sender?.full_name ||
                      message.sender?.email ||
                      "Unknown"}
                  </CardTitle>
                  <CardDescription>
                    To:{" "}
                    {message.recipient?.full_name ||
                      message.recipient?.email ||
                      "Unknown"}
                  </CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  {message.created_at ? formatDate(message.created_at) : ""}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap py-4">{message.content}</div>
            </CardContent>
          </Card>

          {replies && replies.length > 0 && (
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-medium">Replies</h2>
              {replies.map((reply) => (
                <Card key={reply.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">
                          {reply.sender?.full_name ||
                            reply.sender?.email ||
                            "Unknown"}
                        </CardTitle>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {reply.created_at ? formatDate(reply.created_at) : ""}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap py-2">
                      {reply.content}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <UrlProvider>
                <form action={replyToMessageAction} className="space-y-4">
                  <input
                    type="hidden"
                    name="parent_message_id"
                    value={params.id}
                  />
                  <input
                    type="hidden"
                    name="recipient_id"
                    value={
                      message.sender_id === user.id
                        ? message.recipient_id
                        : message.sender_id
                    }
                  />
                  <input
                    type="hidden"
                    name="subject"
                    value={`Re: ${message.subject}`}
                  />

                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Type your reply here"
                    rows={4}
                    required
                  />

                  <div className="flex justify-end">
                    <SubmitButton pendingText="Sending...">
                      <Reply className="h-4 w-4 mr-2" />
                      Send Reply
                    </SubmitButton>
                  </div>

                  <FormMessage message={messageParams} />
                </form>
              </UrlProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
