import { useState, useEffect, useRef } from "react";
import { Bell, Check, Loader2, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Button } from "./ui/button";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    item_id?: number;
    claim_id?: number;
    is_read: boolean;
    created_at: string;
}

export function NotificationDropdown() {
    const { user, session } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        if (!session?.access_token) return;
        try {
            console.log("NotificationDropdown: Fetching notifications...");
            const data = await api.getNotifications(session.access_token);
            console.log("NotificationDropdown: Received:", data);
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user, session]);

    useEffect(() => {
        // Close on click outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: number) => {
        if (!session?.access_token) return;
        try {
            await api.markNotificationAsRead(id, session.access_token);
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'claim_received': return <Info className="w-4 h-4 text-blue-400" />;
            case 'claim_approved': return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'claim_rejected': return <AlertTriangle className="w-4 h-4 text-red-400" />;
            default: return <Bell className="w-4 h-4 text-slate-400" />;
        }
    };

    const getLink = (n: Notification) => {
        if (n.item_id) return `/items/${n.item_id}`;
        return "#";
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-400 hover:text-white transition-colors relative"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-[#0B0C15]"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#13141F] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-white/5 flex justify-between items-center bg-[#0F1016]">
                        <h3 className="text-white font-bold text-sm">Notifications</h3>
                        {unreadCount > 0 && <span className="text-xs text-primary">{unreadCount} new</span>}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                No notifications yet.
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map(notification => (
                                    <Link
                                        key={notification.id}
                                        to={getLink(notification)}
                                        onClick={() => {
                                            if (!notification.is_read) handleMarkAsRead(notification.id);
                                            setIsOpen(false);
                                        }}
                                        className={`block p-4 hover:bg-white/5 transition-colors ${!notification.is_read ? 'bg-white/[0.02]' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1 shrink-0">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="space-y-1">
                                                <p className={`text-sm ${!notification.is_read ? 'text-white font-medium' : 'text-slate-400'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-slate-500 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-slate-600">
                                                    {new Date(notification.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {!notification.is_read && (
                                                <div className="ml-auto mt-1.5">
                                                    <span className="block w-1.5 h-1.5 bg-primary rounded-full"></span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
