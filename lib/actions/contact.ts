"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  subject: z.string().min(5, "Konu en az 5 karakter olmalıdır"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function createContact(data: ContactFormData) {
  try {
    // Validate the data
    const validatedData = contactSchema.parse(data);

    // Create contact message
    const contact = await prismadb.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });

    revalidatePath("/admin/messages");

    return {
      success: true,
      message:
        "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
      data: contact,
    };
  } catch (error) {
    console.error("Contact creation error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Form verilerinde hata var",
        errors: error.issues,
      };
    }

    return {
      success: false,
      message: "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
}

// Retry utility function
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}

// Admin functions for managing contact messages
export async function getContacts() {
  try {
    const contacts = await retryOperation(async () => {
      return await prismadb.contact.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    return {
      success: true,
      data: contacts,
    };
  } catch (error) {
    console.error("Get contacts error after retries:", error);
    return {
      success: false,
      message: "Mesajlar yüklenirken hata oluştu. Lütfen sayfayı yenileyin.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function markContactAsRead(id: string) {
  try {
    // Validate ID
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Geçersiz mesaj ID'si",
      };
    }

    const contact = await retryOperation(async () => {
      return await prismadb.contact.update({
        where: { id },
        data: { isRead: true },
      });
    });

    revalidatePath("/admin/messages");

    return {
      success: true,
      data: contact,
      message: "Mesaj okundu olarak işaretlendi",
    };
  } catch (error) {
    console.error("Mark contact as read error:", error);
    return {
      success: false,
      message:
        "Mesaj durumu güncellenirken hata oluştu. Lütfen tekrar deneyin.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteContact(id: string) {
  try {
    // Validate ID
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Geçersiz mesaj ID'si",
      };
    }

    await retryOperation(async () => {
      return await prismadb.contact.delete({
        where: { id },
      });
    });

    revalidatePath("/admin/messages");

    return {
      success: true,
      message: "Mesaj başarıyla silindi",
    };
  } catch (error) {
    console.error("Delete contact error:", error);

    // Handle specific Prisma errors
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return {
        success: false,
        message: "Silinecek mesaj bulunamadı",
      };
    }

    return {
      success: false,
      message: "Mesaj silinirken hata oluştu. Lütfen tekrar deneyin.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getUnreadContactCount() {
  try {
    const count = await retryOperation(async () => {
      return await prismadb.contact.count({
        where: {
          isRead: false,
        },
      });
    });

    return {
      success: true,
      data: count,
    };
  } catch (error) {
    console.error("Get unread contact count error:", error);
    return {
      success: false,
      data: 0,
      message: "Okunmamış mesaj sayısı alınırken hata oluştu",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
