/* eslint-disable @typescript-eslint/no-explicit-any */


// components/profile/PersonalInfoStep.tsx

import React from "react";
import { PersonalInfoStepProps } from "@/types/profileWizard";

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  updateField,
}) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">
          Personal Information
        </h2>
        <p className="text-purple-200">Let&apos;s start with the basics</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-white font-semibold mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Mumbai, India"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => updateField("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">
            GitHub Profile
          </label>
          <input
            type="url"
            value={formData.github}
            onChange={(e) => updateField("github", e.target.value)}
            placeholder="github.com/johndoe"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-white font-semibold mb-2">
            Portfolio Website
          </label>
          <input
            type="url"
            value={formData.portfolio}
            onChange={(e) => updateField("portfolio", e.target.value)}
            placeholder="johndoe.com"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-white font-semibold mb-2">
            Professional Summary
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="A passionate full-stack developer with 3+ years of experience..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition resize-none"
          />
        </div>
      </div>
    </div>
  );
};