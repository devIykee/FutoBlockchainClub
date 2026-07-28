"use client";

import { ChangeEvent, useRef, useState } from "react";
import { ImagePlus, Loader2, Link2, X } from "lucide-react";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  /** Storage folder prefix: team | hof | misc */
  folder?: string;
  disabled?: boolean;
};

/**
 * Admin image picker: upload to Supabase Storage, with optional paste-URL fallback.
 */
export function ImageUploadField({
  label = "Photo",
  value,
  onChange,
  folder = "team",
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", folder);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (!data.url) throw new Error("No URL returned from upload");
      onChange(String(data.url));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <span className="label-caps">{label}</span>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-card border border-theme bg-bg-high">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-7 w-7 text-ink-dim" aria-hidden />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/70">
              <Loader2 className="h-6 w-6 animate-spin text-cyan" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
              className="btn-secondary !px-3 text-sm"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" />
                  Upload image
                </>
              )}
            </button>
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => setShowUrl((v) => !v)}
              className="btn-secondary !px-3 text-sm"
            >
              <Link2 className="h-4 w-4" />
              {showUrl ? "Hide URL" : "Use URL"}
            </button>
            {value && (
              <button
                type="button"
                disabled={disabled || uploading}
                onClick={() => onChange("")}
                className="btn-secondary !px-3 text-sm text-danger"
                aria-label="Clear photo"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-ink-dim">
            JPEG, PNG, WebP, or GIF · max 2&nbsp;MB · stored in Supabase
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={onFile}
            disabled={disabled || uploading}
          />
        </div>
      </div>

      {showUrl && (
        <label className="block space-y-1.5">
          <span className="label-caps">Or paste image URL</span>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…"
            disabled={disabled || uploading}
            className="field-input"
          />
        </label>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
