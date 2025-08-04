"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession() as { data: Session | null };
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3001/profile", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data);
        setAvatar(data.avatarUrl || null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
        //  Bild an Backend/Cloudinary schicken
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24 mb-2">
              <Image
                src={avatar || "/default-avatar.png"}
                alt="Profilbild"
                fill
                className="rounded-full object-cover border-2 border-primary"
              />
              <label className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <span className="text-xs text-white">✏️</span>
              </label>
            </div>
            <CardTitle>
              {profile?.name || session?.user?.name || "Kein Name"}
            </CardTitle>
            <p className="text-muted-foreground">
              {profile?.email || session?.user?.email}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <span className="font-semibold">ID:</span>{" "}
            {profile?.id || "Unbekannt"}
          </div>

          <Button className="w-full mt-4" variant="outline">
            Profil speichern
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
