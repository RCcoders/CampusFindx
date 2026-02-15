import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Loader2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your Campus Finder AI assistant. How can I help you recover a lost item or report something you've found today?",
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: inputText.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setIsLoading(true);

        // Simulate AI response delay
        setTimeout(() => {
            const aiResponse: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "I'm currently in a demo mode. In the future, I'll be able to help you search for items, identify objects in your photos, and guide you through the recovery process!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <div
                className={cn(
                    "bg-[#0E0F19] border border-white/10 rounded-2xl shadow-2xl w-[350px] sm:w-[400px] mb-4 overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto",
                    isOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-4 pointer-events-none h-0 mb-0"
                )}
            >
                {/* Header */}
                <div className="bg-[#13141F] p-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <Bot className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Campus AI</h3>
                            <p className="text-xs text-indigo-400 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-white hover:bg-white/5 h-8 w-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-[#0B0C15]/50" ref={scrollRef}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                                    msg.role === "user"
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-[#1A1B26] text-slate-200 border border-white/5 rounded-bl-none"
                                )}
                            >
                                {msg.content}
                                <div className={cn(
                                    "text-[10px] mt-1 opacity-50",
                                    msg.role === "user" ? "text-indigo-200" : "text-slate-500"
                                )}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <div className="bg-[#1A1B26] border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-2">
                                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                                <span className="text-xs text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-[#13141F] border-t border-white/5">
                    <div className="relative flex items-center">
                        <Input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask for help..."
                            className="pr-12 bg-[#0B0C15] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputText.trim() || isLoading}
                            className="absolute right-1 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "group relative flex items-center justify-center pointer-events-auto transition-all duration-300",
                    isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
                )}
            >
                <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 blur opacity-40 group-hover:opacity-75 transition-all duration-500 animate-pulse"></span>
                <div className="relative w-14 h-14 bg-[#0E0F19] rounded-full border border-indigo-500/30 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    <Sparkles className="absolute top-0 right-0 w-4 h-4 text-yellow-400 animate-bounce delay-700" style={{ animationDuration: '3s' }} />
                    <Bot className="w-7 h-7 text-indigo-400 group-hover:text-white transition-colors" />
                </div>
                <div className="absolute right-full mr-4 bg-[#13141F] border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 pointer-events-none">
                    Need help?
                </div>
            </button>

            {/* Close button when open (optional, users often expect the main button to toggle, but we hide it to show the window) 
          Actually, let's keep the main toggle logic simple. The window has a close button.
          If we want a toggle effect, we can just make the FAB transform into the Close button or similar.
          For now, standard pattern: FAB opens, window has close. 
      */}
        </div>
    );
}
