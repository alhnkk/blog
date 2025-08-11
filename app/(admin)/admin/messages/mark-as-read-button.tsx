"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MailOpen } from "lucide-react";
import { markContactAsRead } from "@/lib/actions/contact";
import { toast } from "sonner";

interface MarkAsReadButtonProps {
  contactId: string;
}

export function MarkAsReadButton({ contactId }: MarkAsReadButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkAsRead = async () => {
    setIsUpdating(true);

    try {
      const result = await markContactAsRead(contactId);

      if (result.success) {
        toast.success("Mesaj okundu olarak işaretlendi");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Mark as read error:", error);
      toast.error("Mesaj durumu güncellenirken beklenmeyen bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleMarkAsRead}
      disabled={isUpdating}
      className="text-green-600 hover:text-green-700"
    >
      {isUpdating ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      ) : (
        <MailOpen className="h-4 w-4" />
      )}
    </Button>
  );
}
