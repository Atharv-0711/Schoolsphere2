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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, Message } from "@/components/form-message";
import { UrlProvider } from "@/components/url-provider";
import { sendMessageAction } from "@/app/actions";

export default async function NewMessagePage(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get all users that can be messaged based on the current user's role
  let recipientQuery = supabase
    .from("users")
    .select("id, full_name, email, user_role");

  // If user is a teacher, they can message parents
  if (user.user_metadata?.user_role === "teacher") {
    recipientQuery = recipientQuery.eq("user_role", "parent");
  }
  // If user is a parent, they can message teachers
  else if (user.user_metadata?.user_role === "parent") {
    recipientQuery = recipientQuery.eq("user_role", "teacher");
  }
  // If user is an admin, they can message anyone
  else if (user.user_metadata?.user_role === "admin") {
    recipientQuery = recipientQuery.not("id", "eq", user.id);
  }

  const { data: recipients } = await recipientQuery.order("full_name");

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 py-8 pt-24">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              New Message
            </h1>
            <p className="text-muted-foreground mt-1">
              Send a message to a teacher or parent
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>
                Fill out the form below to send a message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UrlProvider>
                <form action={sendMessageAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient_id">Recipient</Label>
                    <select
                      id="recipient_id"
                      name="recipient_id"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select a recipient</option>
                      {recipients &&
                        recipients.map((recipient) => (
                          <option key={recipient.id} value={recipient.id}>
                            {recipient.full_name || recipient.email} (
                            {recipient.user_role})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Enter message subject"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Message</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Type your message here"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" asChild>
                      <a href="/messages">Cancel</a>
                    </Button>
                    <SubmitButton pendingText="Sending...">
                      Send Message
                    </SubmitButton>
                  </div>

                  <FormMessage message={searchParams} />
                </form>
              </UrlProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
