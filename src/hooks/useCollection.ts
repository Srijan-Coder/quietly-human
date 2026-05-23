"use client";

import { useLocalStorage } from "./useLocalStorage";
import { useUser } from "@clerk/nextjs";
import { useEffect, useCallback } from "react";
import { syncCollectionToClerk } from "@/actions/collection";

export type CollectionItem = {
  id: string; // usually the slug or path
  title: string;
  type: "Letter" | "Guide" | "Thought" | "Book" | "letter" | "post" | "book" | "product" | "guide" | "Tool";
  url: string;
  dateSaved: string;
  folderId?: string;
  privateNote?: string;
  hasAudioNote?: boolean;
  readingProgress?: number; // 0 to 100
};

export function useCollection() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [localCollection, setLocalCollection] = useLocalStorage<CollectionItem[]>("quietly-collection", []);

  // Use Clerk's metadata if logged in, otherwise fallback to local storage
  const collection = (isSignedIn && user?.publicMetadata?.savedItems)
    ? (user.publicMetadata.savedItems as CollectionItem[])
    : localCollection;

  // Sync function that runs in the background
  const syncToCloud = useCallback(async (newCollection: CollectionItem[]) => {
    if (isSignedIn) {
      await syncCollectionToClerk(newCollection);
      // We also update user metadata locally to instantly reflect the UI without reloading
      await user?.reload(); 
    }
  }, [isSignedIn, user]);

  const saveItem = (item: Omit<CollectionItem, "dateSaved">) => {
    if (collection.some((i) => i.id === item.id)) return;
    
    const newCollection = [
      { ...item, dateSaved: new Date().toISOString() },
      ...collection,
    ];

    setLocalCollection(newCollection);
    syncToCloud(newCollection);
  };

  const updateItem = (id: string, updates: Partial<CollectionItem>) => {
    const newCollection = collection.map((item) => 
      item.id === id ? { ...item, ...updates } : item
    );
    setLocalCollection(newCollection);
    syncToCloud(newCollection);
  };

  const removeItem = (id: string) => {
    const newCollection = collection.filter((item) => item.id !== id);
    setLocalCollection(newCollection);
    syncToCloud(newCollection);
  };

  const isSaved = (id: string) => {
    return collection.some((item) => item.id === id);
  };

  // On first load, if they just logged in and have a local collection, merge it!
  useEffect(() => {
    if (isLoaded && isSignedIn && localCollection.length > 0) {
      const cloudCollection = (user?.publicMetadata?.savedItems as CollectionItem[]) || [];
      
      // Simple merge logic: if local has stuff cloud doesn't, push to cloud
      let needsSync = false;
      const merged = [...cloudCollection];
      
      localCollection.forEach(localItem => {
        if (!merged.some(c => c.id === localItem.id)) {
          merged.push(localItem);
          needsSync = true;
        }
      });

      if (needsSync) {
        setLocalCollection(merged);
        syncToCloud(merged);
      }
    }
  }, [isLoaded, isSignedIn, user, localCollection, setLocalCollection, syncToCloud]);

  return {
    collection,
    saveItem,
    updateItem,
    removeItem,
    isSaved,
  };
}
