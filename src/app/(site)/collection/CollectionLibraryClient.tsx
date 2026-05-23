"use client";

import { useCollection, CollectionItem } from "@/hooks/useCollection";
import { useFolders } from "@/hooks/useFolders";
import { useHeatmap } from "@/hooks/useHeatmap";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAudioNotes } from "@/hooks/useAudioNotes";

function CollectionItemCard({ item, folders }: { item: CollectionItem; folders: { id: string; name: string; createdAt: string }[] }) {
  const { removeItem, updateItem } = useCollection();
  const { audioUrl, isRecording, startRecording, stopRecording, deleteNote } = useAudioNotes(item.id);

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(item.privateNote || "");

  const saveTextNote = () => {
    updateItem(item.id, { privateNote: noteText });
    setIsEditingNote(false);
  };

  const moveToFolder = (folderId: string) => {
    updateItem(item.id, { folderId: folderId === "none" ? undefined : folderId });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-brand-card border border-brand-border rounded-xl p-6 flex flex-col group hover:border-brand-accent transition-colors shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] uppercase tracking-widest text-brand-soft bg-brand-bg px-2 py-1 rounded-md">
          {item.type}
        </span>
        <div className="flex items-center gap-2">
          <select
            value={item.folderId || "none"}
            onChange={(e) => moveToFolder(e.target.value)}
            className="text-[10px] uppercase tracking-widest text-brand-soft bg-transparent border-none outline-none cursor-pointer hover:text-brand-text"
          >
            <option value="none">No Folder</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <button onClick={() => removeItem(item.id)} className="text-brand-soft hover:text-red-400 text-sm">✕</button>
        </div>
      </div>

      <h3 className="text-xl text-brand-text mb-4 leading-snug font-serif">{item.title}</h3>

      {/* Reading Progress */}
      {item.readingProgress !== undefined && item.readingProgress > 0 && (
        <div className="w-full h-1 bg-brand-bg rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-brand-accent transition-all" style={{ width: `${item.readingProgress}%` }} />
        </div>
      )}

      {/* Notes Section */}
      <div className="mt-auto pt-4 border-t border-brand-border/50 flex flex-col gap-4">

        {/* Private Text Note */}
        {isEditingNote ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a private note..."
              className="w-full bg-brand-bg border border-brand-border rounded-md p-2 text-sm text-brand-text focus:outline-none focus:border-brand-accent resize-none font-serif h-24"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditingNote(false)} className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text">Cancel</button>
              <button onClick={saveTextNote} className="text-[10px] uppercase tracking-widest text-brand-accent hover:text-white bg-brand-accent/10 px-2 py-1 rounded">Save</button>
            </div>
          </div>
        ) : (
          <div className="group/note">
            <p className="text-sm text-brand-soft font-serif italic line-clamp-3">
              {item.privateNote ? `"${item.privateNote}"` : "No private note."}
            </p>
            <button
              onClick={() => setIsEditingNote(true)}
              className="text-[10px] uppercase tracking-widest text-brand-text opacity-0 group-hover/note:opacity-100 transition-opacity mt-1"
            >
              {item.privateNote ? "Edit Note" : "+ Add Note"}
            </button>
          </div>
        )}

        {/* Audio Note (Voice Memo) */}
        <div className="flex items-center gap-3 bg-brand-bg/50 p-2 rounded-lg border border-brand-border/30">
          {audioUrl ? (
            <div className="flex items-center gap-2 w-full">
              <audio src={audioUrl} controls className="h-8 w-full max-w-[150px] grayscale" />
              <button onClick={deleteNote} className="text-xs text-brand-soft hover:text-red-400 ml-auto">✕</button>
            </div>
          ) : (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`text-xs flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${isRecording ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-brand-card text-brand-soft hover:text-brand-text border border-brand-border"}`}
            >
              <span className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500" : "bg-brand-soft"}`} />
              {isRecording ? "Recording... (Stop)" : "Record Voice Memo"}
            </button>
          )}
        </div>

        <Link
          href={item.url}
          className="text-center w-full block py-2 mt-2 bg-brand-text text-brand-bg rounded-md text-[10px] uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all font-bold"
        >
          {item.type === "Tool" ? "Open Tool" : "Read Content"}
        </Link>
      </div>
    </motion.div>
  );
}

function Heatmap() {
  const { activityDates } = useHeatmap();

  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl p-6">
      <h3 className="text-sm uppercase tracking-widest text-brand-soft mb-4">Healing Journey (Last 30 Days)</h3>
      <div className="flex flex-wrap gap-1">
        {days.map((day) => {
          const isActive = activityDates.includes(day);
          return (
            <div
              key={day}
              title={day}
              className={`w-3 h-3 rounded-sm ${isActive ? "bg-brand-accent shadow-[0_0_5px_rgba(252,163,17,0.5)]" : "bg-brand-border/30"}`}
            />
          );
        })}
      </div>
      <p className="text-[10px] text-brand-soft mt-3 italic">Every bright square is a moment you chose to pause.</p>
    </div>
  );
}

export default function CollectionLibraryClient() {
  const { isLoaded, isSignedIn } = useAuth();
  const { collection } = useCollection();
  const { folders, createFolder, deleteFolder } = useFolders();

  const [activeFolderId, setActiveFolderId] = useState<string>("all");
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const filteredCollection = activeFolderId === "all"
    ? collection
    : collection.filter((item) => item.folderId === activeFolderId);

  if (!isLoaded) return <div className="text-center italic font-serif opacity-50 py-20">Opening vault...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-12 font-serif">

      {/* LEFT SIDEBAR */}
      <aside className="w-full lg:w-64 flex flex-col gap-8 shrink-0">

        <Heatmap />

        {/* The Archive Link */}
        <Link href="/archive" className="bg-brand-card border border-brand-border hover:border-brand-accent rounded-xl p-6 transition-all group flex items-center justify-between">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-brand-text mb-1 flex items-center gap-2"><span>⏳</span> Quiet Archive</h3>
            <p className="text-[10px] text-brand-soft">Your time capsules</p>
          </div>
          <span className="text-brand-soft group-hover:text-brand-accent transition-colors">→</span>
        </Link>

        {/* Folders List */}
        <div>
          <h3 className="text-sm uppercase tracking-widest text-brand-soft mb-4 flex items-center justify-between">
            Your Kits
            <button onClick={() => setIsCreatingFolder(true)} className="hover:text-brand-text">+</button>
          </h3>

          <ul className="flex flex-col gap-2">
            <li>
              <button
                onClick={() => setActiveFolderId("all")}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${activeFolderId === "all" ? "bg-brand-accent/10 text-brand-accent font-bold" : "text-brand-text hover:bg-brand-card"}`}
              >
                All Saved Items
              </button>
            </li>
            {folders.map((folder) => (
              <li key={folder.id} className="group/folder flex items-center">
                <button
                  onClick={() => setActiveFolderId(folder.id)}
                  className={`flex-1 text-left px-4 py-2 rounded-lg text-sm transition-all ${activeFolderId === folder.id ? "bg-brand-accent/10 text-brand-accent font-bold" : "text-brand-text hover:bg-brand-card"}`}
                >
                  📁 {folder.name}
                </button>
                <button
                  onClick={() => deleteFolder(folder.id)}
                  className="opacity-0 group-hover/folder:opacity-100 text-[10px] text-red-400 p-2 uppercase tracking-widest"
                >
                  Del
                </button>
              </li>
            ))}
          </ul>

          {isCreatingFolder && (
            <form onSubmit={handleCreateFolder} className="mt-4 flex flex-col gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="bg-brand-card border border-brand-border px-3 py-2 text-sm rounded-md text-brand-text focus:outline-none focus:border-brand-accent font-sans"
              />
              <div className="flex gap-2">
                <button type="submit" className="text-[10px] uppercase tracking-widest text-brand-bg bg-brand-text px-2 py-1 rounded">Create</button>
                <button type="button" onClick={() => setIsCreatingFolder(false)} className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-border pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl text-brand-text mb-2">
              {activeFolderId === "all" ? "My Vault" : folders.find((f) => f.id === activeFolderId)?.name || "Folder"}
            </h1>
            <p className="text-brand-soft font-sans tracking-widest uppercase text-xs">
              {isSignedIn ? "Securely synced." : "Stored locally. Sign in to save permanently."}
            </p>
          </div>

          {/* Shareable Link Button */}
          {activeFolderId !== "all" && isSignedIn && (
            <button
              onClick={async () => {
                const folderName = folders.find((f) => f.id === activeFolderId)?.name;
                const items = collection.filter((i) => i.folderId === activeFolderId);
                if (!folderName || items.length === 0) { alert("Folder is empty"); return; }

                const res = await fetch("/api/share-folder", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ folderName, items }),
                });
                const data = await res.json();
                if (data.success) {
                  const url = `${window.location.origin}/kit/${data.kitId}`;
                  navigator.clipboard.writeText(url);
                  alert("Shareable link copied to clipboard!");
                } else {
                  alert("Failed to create link: " + data.error);
                }
              }}
              className="text-[10px] uppercase tracking-widest text-brand-accent border border-brand-accent/30 px-4 py-2 rounded-full hover:bg-brand-accent hover:text-brand-bg transition-colors flex items-center gap-2"
            >
              <span>🔗</span> Create Shareable Link
            </button>
          )}
        </header>

        {filteredCollection.length === 0 ? (
          <div className="text-center py-24 border border-brand-border border-dashed rounded-xl bg-brand-card/30">
            <p className="text-brand-soft text-lg mb-4 italic">This space is empty.</p>
            <Link href="/search" className="text-xs uppercase tracking-widest text-brand-text hover:text-brand-accent transition-colors border-b border-brand-text pb-1">
              Explore the Sanctuary to find tools
            </Link>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredCollection.map((item) => (
                <CollectionItemCard key={item.id} item={item} folders={folders} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

    </div>
  );
}
