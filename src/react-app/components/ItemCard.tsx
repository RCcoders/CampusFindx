import { Card, CardContent } from "../components/ui/card";
import { MapPin, Calendar, Package } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { categoryIcons } from "../lib/constants";
import { SecureImage } from "./SecureImage";

// Extended interface to support both Source and Destination item types
export interface ItemCardProps {
    item: {
        id: number | string;
        title: string;
        description: string;
        category: string;
        location: string;
        status: string;
        dateFound?: string; // Source style
        date_found_or_lost?: string; // Destination style
        image_url?: string | null; // Destination style
        imageUrl?: string; // Source style
    }
}

const ItemCard = ({ item }: ItemCardProps) => {
    const date = item.dateFound || (item.date_found_or_lost ? new Date(item.date_found_or_lost).toLocaleDateString() : "Unknown Date");
    const imageUrl = item.image_url || item.imageUrl;

    return (
        <Card className="group shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 overflow-hidden">
            {imageUrl && (
                <div className="relative h-40 w-full bg-muted/50 overflow-hidden">
                    {/* Use SecureImage if it's a storage path, else normal img */}
                    {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                        <img src={imageUrl} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                        <SecureImage storagePath={imageUrl} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    )}
                </div>
            )}
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-xl">
                        {/* Safe access to category icon */}
                        {categoryIcons[item.category as keyof typeof categoryIcons] || <Package className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <StatusBadge status={item.status} />
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-foreground leading-snug truncate">
                    {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {item.description}
                </p>
                <div className="mt-4 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {date}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ItemCard;
