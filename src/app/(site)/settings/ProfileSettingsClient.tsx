"use client";

import { useState } from "react";
import Image from "next/image";

type ProfileSettingsClientProps = {
  initialProfile: {
    display_name: string | null;
    username: string;
    avatar_url: string | null;
    last_name_change_at: string | null;
    bio: string | null;
  };
};

export default function ProfileSettingsClient({ initialProfile }: ProfileSettingsClientProps) {
  const [displayName, setDisplayName] = useState(initialProfile.display_name || "");
  const [username, setUsername] = useState(initialProfile.username || "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url || "");
  const [bio, setBio] = useState(initialProfile.bio || "");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "error" | "success" } | null>(null);

  // Compress image client-side before upload to stay under Vercel's 4.5MB limit
  const compressImage = (file: File, maxSize: number = 512): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          
          // Scale down to maxSize x maxSize while keeping aspect ratio
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("Canvas not supported")); return; }
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Compression failed"));
            },
            "image/jpeg",
            0.8 // 80% quality
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ text: "Please upload an image file.", type: "error" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ text: "File is too large. Please upload an image smaller than 10MB.", type: "error" });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      // Compress on the client — output is always < 500KB
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], `avatar.jpg`, { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("bucket", "avatars");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Guard against Vercel returning HTML error pages
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Upload failed — server returned an unexpected response. The image may be too large.");
      }

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setAvatarUrl(data.url);
      setMessage({ text: "Image uploaded successfully. Don't forget to save changes.", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          username,
          avatarUrl,
          bio
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const calculateDaysLeft = () => {
    if (!initialProfile.last_name_change_at) return 0;
    const lastChange = new Date(initialProfile.last_name_change_at).getTime();
    const now = Date.now();
    const daysPassed = (now - lastChange) / (1000 * 60 * 60 * 24);
    if (daysPassed >= 14) return 0;
    return Math.ceil(14 - daysPassed);
  };

  const daysLeft = calculateDaysLeft();
  const canChangeName = daysLeft === 0;

  return (
    <div className="flex flex-col gap-6">
      {message && (
        <div className={`p-4 rounded-xl text-sm ${message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
          {message.text}
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#1a1a1a] border border-white/10 shrink-0">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-brand-soft font-sans">
              {(displayName || username).charAt(0).toUpperCase()}
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-xs text-white">...</span>
            </div>
          )}
        </div>
        
        <div>
          <label className="cursor-pointer bg-brand-bg hover:bg-brand-card transition-colors px-4 py-2 rounded-full text-xs font-sans text-brand-text border border-brand-border">
            {isUploading ? "Uploading..." : "Upload New Picture"}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
          </label>
          <p className="text-[10px] text-brand-soft mt-3 font-sans">Any image up to 10MB. It will be auto-compressed.</p>
        </div>
      </div>

      <div className="h-px w-full bg-white/5 my-2" />

      {/* Name and Username Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-brand-soft uppercase tracking-widest font-sans">Display Name</label>
          <input 
            type="text" 
            value={displayName} 
            onChange={e => setDisplayName(e.target.value)}
            disabled={!canChangeName}
            className="bg-brand-bg/50 border border-brand-border rounded-xl px-4 py-3 text-brand-text font-serif focus:outline-none focus:border-brand-accent disabled:opacity-50" 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-brand-soft uppercase tracking-widest font-sans">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-soft">@</span>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              disabled={!canChangeName}
              className="w-full bg-brand-bg/50 border border-brand-border rounded-xl pl-9 pr-4 py-3 text-brand-text font-serif focus:outline-none focus:border-brand-accent disabled:opacity-50" 
            />
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-brand-soft uppercase tracking-widest font-sans">Biography / About Me</label>
        <textarea 
          value={bio} 
          onChange={e => setBio(e.target.value.substring(0, 200))}
          placeholder="Write a short description to show visitors in your room..."
          className="w-full bg-brand-bg/50 border border-brand-border rounded-xl px-4 py-3 text-brand-text font-serif focus:outline-none focus:border-brand-accent min-h-[100px] resize-y" 
          maxLength={200}
        />
        <div className="text-right text-[10px] font-sans text-brand-soft">
          {bio.length} / 200 Characters
        </div>
      </div>

      {!canChangeName && (
        <p className="text-xs text-brand-accent italic font-sans flex items-center gap-2">
          <span>🔒</span> You recently changed your name. You can change it again in {daysLeft} days.
        </p>
      )}
      {canChangeName && (
        <p className="text-[10px] text-brand-soft font-sans">
          Note: You can only change your display name and username once every 14 days.
        </p>
      )}

      <button 
        onClick={handleSave}
        disabled={isSaving}
        className="mt-4 px-8 py-3 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest font-bold self-start hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer"
      >
        {isSaving ? "Saving..." : "Save Profile Changes"}
      </button>
    </div>
  );
}
