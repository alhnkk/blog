"use client";

import { useState, useTransition } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Shield, User } from "lucide-react";
import { updateUserRole } from "@/lib/actions/user-management";
import { toast } from "sonner";

interface UserRoleButtonProps {
  userId: string;
  currentRole: "USER" | "ADMIN";
}

export function UserRoleButton({ userId, currentRole }: UserRoleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = () => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

    startTransition(async () => {
      try {
        const result = await updateUserRole(userId, newRole);

        if (result.success) {
          toast.success(
            `Kullanıcı rolü ${
              newRole === "ADMIN" ? "Admin" : "Kullanıcı"
            } olarak güncellendi`
          );
        } else {
          toast.error(result.error || "Rol güncellenemedi");
        }
      } catch (error) {
        toast.error("Bir hata oluştu");
      }
    });
  };

  return (
    <DropdownMenuItem onClick={handleRoleChange} disabled={isPending}>
      {currentRole === "ADMIN" ? (
        <>
          <User className="h-4 w-4 mr-2" />
          Kullanıcı Yap
        </>
      ) : (
        <>
          <Shield className="h-4 w-4 mr-2" />
          Admin Yap
        </>
      )}
    </DropdownMenuItem>
  );
}
