"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { createBrowserClient } from "@supabase/ssr";

export function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const fetchUnreadCount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .eq("recipient_id", user.id)
        .eq("read", false);

      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Set up realtime subscription for new messages
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          // Check if the current user is the recipient
          if (payload.new && payload.new.recipient_id === user?.id) {
            setUnreadCount((prev) => prev + 1);

            // Show browser notification if supported
            if (Notification.permission === "granted") {
              new Notification("New Message", {
                body: `You have received a new message: ${payload.new.subject}`,
                icon: "/favicon.ico",
              });
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        () => {
          // Refresh count when messages are updated (marked as read)
          fetchUnreadCount();
        },
      )
      .subscribe();

    // Request notification permission
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (unreadCount === 0) return null;

  return (
    <Badge
      variant="destructive"
      className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
    >
      {unreadCount > 9 ? "9+" : unreadCount}
    </Badge>
  );
}
