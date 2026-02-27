import React from "react";
import { motion } from "motion/react";
import { Card } from "./Card";

export const SettingsSection = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <Card className="flex flex-col mb-6 lg:mb-8">
        <div className="p-6 border-b border-[#1A1B1E]">
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
            <p className="text-sm text-zinc-500 mt-1">{description}</p>
        </div>
        <div className="p-6 flex flex-col gap-6">
            {children}
        </div>
    </Card>
);

export const ToggleSwitch = ({ enabled, onChange, label, description }: { enabled: boolean, onChange: (val: boolean) => void, label: string, description?: string }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <div className="text-sm font-medium text-white">{label}</div>
                {description && <div className="text-xs text-zinc-500 mt-0.5">{description}</div>}
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#111] ${enabled ? 'bg-emerald-500' : 'bg-[#1A1B1E]'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
};

export const StyledInput = ({ label, placeholder, value, onChange, type = "text", rightElement }: any) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-400">{label}</label>
        <div className="relative flex items-center">
            <input
                type={type}
                className="w-full bg-[#1A1B1E] border border-[#2A2B2E] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-zinc-600 text-sm"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {rightElement && (
                <div className="absolute right-3">
                    {rightElement}
                </div>
            )}
        </div>
    </div>
);

export const ActionBtn = ({ children, onClick, variant = "primary", className = "", disabled = false }: any) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium text-sm transition-colors focus:outline-none";
    let variantStyles = "";

    if (variant === "primary") {
        variantStyles = "bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white";
    } else if (variant === "danger") {
        variantStyles = "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-transparent hover:border-red-500/50";
    } else if (variant === "secondary") {
        variantStyles = "bg-[#1A1B1E] text-white border border-[#2A2B2E] hover:border-zinc-600";
    }

    return (
        <motion.button
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {children}
        </motion.button>
    );
};

export const PillSelector = ({ options, selected, onChange }: { options: string[], selected: string, onChange: (val: string) => void }) => {
    return (
        <div className="flex bg-[#1A1B1E] p-1 rounded-lg border border-[#2A2B2E]">
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${selected === opt
                            ? "bg-[#2A2B2E] text-white shadow-sm"
                            : "text-zinc-500 hover:text-white hover:bg-white/5"
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    )
}
