"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { CollectionItem } from "@/hooks/useCollection";

export async function syncCollectionToClerk(collection: CollectionItem[]) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const client = await clerkClient();

    // Store the collection in publicMetadata so it can be read instantly on the client via useUser()
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        savedItems: collection
      }
    });

    // Also sync to Sanity Database so the admin can see it
    const sanityUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000";
    await fetch(`${sanityUrl}/api/collection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ savedItems: collection })
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to sync collection to Clerk:", error);
    return { success: false, error: "Failed to sync" };
  }
}
