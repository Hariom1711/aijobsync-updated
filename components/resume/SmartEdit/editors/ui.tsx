"use client";

export const Input = (props: any) => (
  <input
    {...props}
    className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
  />
);

export const Textarea = (props: any) => (
  <textarea
    {...props}
    className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
  />
);

export const Label = ({ children }: any) => (
  <label className="text-xs text-purple-300 font-medium">
    {children}
  </label>
);

export const Block = ({ children }: any) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
    {children}
  </div>
);