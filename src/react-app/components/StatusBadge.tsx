import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";

type StatusType = "unclaimed" | "claimed" | "under_review" | "handed_over" | "expired" | "pending" | "approved" | "rejected" | "handover_complete" | "open" | "matched" | "resolved";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
    unclaimed: { label: "Unclaimed", className: "bg-warning/15 text-warning border-warning/30" },
    claimed: { label: "Claimed", className: "bg-primary/10 text-primary border-primary/30" },
    under_review: { label: "Under Review", className: "bg-accent/15 text-accent-foreground border-accent/30" },
    handed_over: { label: "Handed Over", className: "bg-success/15 text-success border-success/30" },
    expired: { label: "Expired", className: "bg-muted text-muted-foreground border-border" },
    pending: { label: "Pending", className: "bg-warning/15 text-warning border-warning/30" },
    approved: { label: "Approved", className: "bg-success/15 text-success border-success/30" },
    rejected: { label: "Rejected", className: "bg-destructive/15 text-destructive border-destructive/30" },
    handover_complete: { label: "Complete", className: "bg-success/15 text-success border-success/30" },
    open: { label: "Open", className: "bg-warning/15 text-warning border-warning/30" },
    matched: { label: "Matched", className: "bg-primary/10 text-primary border-primary/30" },
    resolved: { label: "Resolved", className: "bg-success/15 text-success border-success/30" },
};

const StatusBadge = ({ status }: { status: StatusType | string }) => {
    // Safe fallback if status is not in config
    const config = statusConfig[status as StatusType] || { label: status, className: "bg-secondary/15 text-secondary border-secondary/30" };
    return (
        <Badge variant="outline" className={cn("font-medium", config.className)}>
            {config.label}
        </Badge>
    );
};

export default StatusBadge;
