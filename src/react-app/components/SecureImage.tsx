import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    storagePath: string | null;
    alt: string;
    className?: string;
    fallback?: React.ReactNode;
}

export function SecureImage({ storagePath, alt, className, fallback, ...props }: SecureImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchSignedUrl() {
            if (!storagePath) {
                setIsLoading(false);
                return;
            }

            // If it's already a full URL (e.g. from R2 or external), just use it
            if (storagePath.startsWith("http")) {
                setImageUrl(storagePath);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const { data, error } = await supabase.storage
                    .from("item-images")
                    .createSignedUrl(storagePath, 3600); // 1 hour expiry

                if (error) {
                    throw error;
                }

                if (isMounted) {
                    setImageUrl(data.signedUrl);
                }
            } catch (err) {
                console.error("Error fetching signed URL:", err);
                if (isMounted) {
                    setError("Failed to load image");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchSignedUrl();

        return () => {
            isMounted = false;
        };
    }, [storagePath]);

    if (isLoading) {
        return (
            <div className={cn("flex items-center justify-center bg-secondary/20 animate-pulse", className)}>
                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
        );
    }

    if (error || !imageUrl) {
        return (
            <div className={cn("flex items-center justify-center bg-secondary/20", className)}>
                {fallback || <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50" />}
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={cn("object-cover", className)}
            {...props}
        />
    );
}
