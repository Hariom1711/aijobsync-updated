// hooks/useMasterProfile.ts
// Refactored: SWR-style caching, no duplicate profileApi.ts needed
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { FormData } from "@/types/profileWizard";

export interface MasterProfileData {
  id: string;
  userId: string;
  fullName: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  summary: string | null;
  education: unknown;
  experience: unknown;
  projects: unknown;
  certifications: unknown;
  achievements: unknown;
  coreSkills: unknown;
  softSkills: string[];
  tools: string[];
  codingProfiles: unknown;
  languages: unknown;
  completeness: number | null;
  lastUpdated: string;
  createdAt: string;
}

// Simple in-memory cache — survives re-renders, cleared on save
let _cache: MasterProfileData | null | undefined = undefined;
let _cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

export const useMasterProfile = () => {
  const [profile, setProfile] = useState<MasterProfileData | null>(
    _cache ?? null
  );
  const [loading, setLoading] = useState(_cache === undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const fetchProfile = useCallback(async (force = false) => {
    // Use cache if fresh
    if (!force && _cache !== undefined && Date.now() - _cacheTime < CACHE_TTL) {
      setProfile(_cache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/profile");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to fetch profile");

      _cache = data.profile;
      _cacheTime = Date.now();
      if (mounted.current) setProfile(data.profile);
    } catch (err) {
      if (mounted.current)
        setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveProfile = async (formData: FormData) => {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save profile");

      _cache = data.profile;
      _cacheTime = Date.now();
      setProfile(data.profile);
      return { success: true, profile: data.profile };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save profile";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  };

  const updateSection = async (section: string, data: unknown) => {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Failed to update section");

      _cache = result.profile;
      _cacheTime = Date.now();
      setProfile(result.profile);
      return { success: true, profile: result.profile };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update section";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  };

  const deleteProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/profile", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete profile");

      _cache = null;
      _cacheTime = Date.now();
      setProfile(null);
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete profile";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  };

  const toFormData = (): FormData | null => {
    if (!profile) return null;
    return {
      fullName: profile.fullName ?? "",
      email: "",
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      linkedin: profile.linkedin ?? "",
      github: profile.github ?? "",
      portfolio: profile.portfolio ?? "",
      summary: profile.summary ?? "",
      education: (profile.education as FormData["education"]) ?? [],
      experience: (profile.experience as FormData["experience"]) ?? [],
      projects: (profile.projects as FormData["projects"]) ?? [],
      coreSkills: (profile.coreSkills as FormData["coreSkills"]) ?? {},
      softSkills: profile.softSkills ?? [],
      tools: profile.tools ?? [],
      certifications: (profile.certifications as FormData["certifications"]) ?? [],
      achievements: (profile.achievements as FormData["achievements"]) ?? [],
      codingProfiles: (profile.codingProfiles as FormData["codingProfiles"]) ?? [],
      languages: (profile.languages as FormData["languages"]) ?? [],
    };
  };

  return {
    profile,
    loading,
    saving,
    error,
    fetchProfile: () => fetchProfile(true),
    saveProfile,
    updateSection,
    deleteProfile,
    toFormData,
  };
};
