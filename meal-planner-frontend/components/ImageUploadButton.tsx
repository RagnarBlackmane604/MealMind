"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";

export function ImageUploadButton({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
      }
    } catch (error) {
      // Optional: Fehlerbehandlung
    } finally {
      setLoading(false); // <-- Ladebalken
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          <ImagePlus className="h-5 w-5" />
        )}
        Upload Picture
      </Button>
    </div>
  );
}
