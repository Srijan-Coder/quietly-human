"use client";

import { useLocalStorage } from "./useLocalStorage";

export type CollectionItem = {
  id: string; // usually the slug or path
  title: string;
  type: "Letter" | "Guide" | "Thought" | "Book";
  url: string;
  dateSaved: string;
};

export function useCollection() {
  const [collection, setCollection] = useLocalStorage<CollectionItem[]>("quietly-collection", []);

  const saveItem = (item: Omit<CollectionItem, "dateSaved">) => {
    // Avoid duplicates
    if (collection.some((i) => i.id === item.id)) return;
    
    setCollection([
      { ...item, dateSaved: new Date().toISOString() },
      ...collection,
    ]);
  };

  const removeItem = (id: string) => {
    setCollection(collection.filter((item) => item.id !== id));
  };

  const isSaved = (id: string) => {
    return collection.some((item) => item.id === id);
  };

  return {
    collection,
    saveItem,
    removeItem,
    isSaved,
  };
}
