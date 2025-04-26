import { headers } from "next/headers";

export async function logAction(
  action: string,
  details?: string,
  userId?: string
) {
  try {
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        details,
        userId,
      }),
    });

    if (!response.ok) {
      console.error("Failed to log action:", action);
    }
  } catch (error) {
    console.error("Error logging action:", error);
  }
} 