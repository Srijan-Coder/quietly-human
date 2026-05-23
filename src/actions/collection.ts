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

    return { success: true };
  } catch (error) {
    console.error("Failed to sync collection to Clerk:", error);
    return { success: false, error: "Failed to sync" };
  }
}
