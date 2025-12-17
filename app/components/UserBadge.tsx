import { ShieldCheck, Rocket, Briefcase } from "lucide-react";

type UserRole = "admin" | "founder" | "agency" | "member" | string;

interface UserBadgeProps {
    role?: UserRole;
    className?: string;
    showLabel?: boolean;
}

export default function UserBadge({ role, className = "", showLabel = true }: UserBadgeProps) {
    if (!role || role === "member") return null;

    let badgeConfig = {
        icon: ShieldCheck,
        label: "Membro",
        style: "bg-gray-800 text-gray-300 border-gray-700",
    };

    switch (role.toLowerCase()) {
        case "admin":
            badgeConfig = {
                icon: ShieldCheck,
                label: "Admin",
                style: "bg-purple-900/40 text-purple-400 border-purple-500/30 ring-1 ring-purple-500/20",
            };
            break;
        case "founder":
            badgeConfig = {
                icon: Rocket,
                label: "Founder",
                style: "bg-amber-900/40 text-amber-400 border-amber-500/30 ring-1 ring-amber-500/20",
            };
            break;
        case "agency":
            badgeConfig = {
                icon: Briefcase,
                label: "Agência",
                style: "bg-blue-900/40 text-blue-400 border-blue-500/30 ring-1 ring-blue-500/20",
            };
            break;
    }

    const Icon = badgeConfig.icon;

    return (
        <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeConfig.style} ${className}`}
            title={badgeConfig.label}
        >
            <Icon size={10} strokeWidth={3} />
            {showLabel && <span>{badgeConfig.label}</span>}
        </div>
    );
}
