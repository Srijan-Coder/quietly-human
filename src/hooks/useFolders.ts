"use client";

import { useLocalStorage } from "./useLocalStorage";
import { useUser } from "@clerk/nextjs";
import { useEffect, useCallback } from "react";
import { syncFoldersToClerk } from "@/actions/collection";

export type Folder = {
  id: string;
  name: string;
  createdAt: string;
};

export function useFolders() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [localFolders, setLocalFolders] = useLocalStorage<Folder[]>("quietly-folders", []);

  // Use Clerk's metadata if logged in, otherwise fallback to local storage
  const folders = (isSignedIn && user?.publicMetadata?.folders)
    ? (user.publicMetadata.folders as Folder[])
    : localFolders;

  const syncToCloud = useCallback(async (newFolders: Folder[]) => {
    if (isSignedIn) {
      await syncFoldersToClerk(newFolders);
      await user?.reload(); 
    }
  }, [isSignedIn, user]);

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: "folder_" + Math.random().toString(36).substring(2, 9),
      name,
      createdAt: new Date().toISOString(),
    };
    const newFolders = [...folders, newFolder];
    setLocalFolders(newFolders);
    syncToCloud(newFolders);
    return newFolder.id;
  };

  const deleteFolder = (id: string) => {
    const newFolders = folders.filter((f) => f.id !== id);
    setLocalFolders(newFolders);
    syncToCloud(newFolders);
  };

  // Merge logic on load
  useEffect(() => {
    if (isLoaded && isSignedIn && localFolders.length > 0) {
      const cloudFolders = (user?.publicMetadata?.folders as Folder[]) || [];
      let needsSync = false;
      const merged = [...cloudFolders];
      
      localFolders.forEach(localItem => {
        if (!merged.some(c => c.id === localItem.id)) {
          merged.push(localItem);
          needsSync = true;
        }
      });

      if (needsSync) {
        setLocalFolders(merged);
        syncToCloud(merged);
      }
    }
  }, [isLoaded, isSignedIn, user, localFolders, setLocalFolders, syncToCloud]);

  return {
    folders,
    createFolder,
    deleteFolder,
  };
}
