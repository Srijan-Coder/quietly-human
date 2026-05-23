"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { CollectionItem } from "@/hooks/useCollection";
import { Folder } from "@/hooks/useFolders";

export async function syncCollectionToClerk(collection: CollectionItem[]) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        savedItems: collection
      }
    });

    const sanityUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000";
    await fetch(`${sanityUrl}/api/collection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ savedItems: collection })
    }).catch(e => console.warn("Sanity sync failed", e));

    return { success: true };
  } catch (error) {
    console.error("Failed to sync collection to Clerk:", error);
    return { success: false, error: "Failed to sync" };
  }
}

export async function syncFoldersToClerk(folders: Folder[]) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        folders: folders
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to sync folders to Clerk:", error);
    return { success: false, error: "Failed to sync folders" };
  }
}
