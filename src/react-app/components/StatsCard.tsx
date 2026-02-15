import { Card, CardContent } from "../components/ui/card";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    description?: string;
    accent?: boolean;
}

const StatsCard = ({ icon: Icon, label, value, description, accent }: StatsCardProps) => {
    return (
        <Card className={`shadow-card transition-all duration-300 hover:shadow-card-hover ${accent ? "border-accent/40" : ""}`}>
            <CardContent className="p-5">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent ? "bg-gradient-accent" : "bg-primary"}`}>
                        <Icon className={`h-5 w-5 ${accent ? "text-accent-foreground" : "text-primary-foreground"}`} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="font-display text-2xl font-bold text-foreground">{value}</p>
                    </div>
                </div>
                {description && (
                    <p className="mt-2 text-xs text-muted-foreground">{description}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default StatsCard;
