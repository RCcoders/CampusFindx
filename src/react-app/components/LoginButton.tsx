import { useAuth } from "../lib/auth";
import { LogIn, LogOut, User, Shield } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { ExtendedUser } from "../../shared/types";

export default function LoginButton() {
  const { user, redirectToLogin, logout, isPending } = useAuth();
  const extendedUser = user as ExtendedUser | null;

  if (isPending) {
    return (
      <Button variant="ghost" disabled>
        <User className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (!user) {
    return (
      <Button onClick={redirectToLogin} variant="outline">
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "authority":
        return (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
            Authority
          </span>
        );
      case "assisted":
        return (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            Assisted
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.google_user_data.picture || undefined} />
            <AvatarFallback>
              {user.google_user_data.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">{user.google_user_data.name || user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.google_user_data.name || "User"}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
            {extendedUser?.role && (
              <div className="pt-1">{getRoleBadge(extendedUser.role)}</div>
            )}
          </div>
        </DropdownMenuLabel>
        {extendedUser && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-slate-500">
              <div className="flex justify-between items-center">
                <span>Reputation Points</span>
                <span className="font-semibold text-green-600">
                  {extendedUser.reputation_points}
                </span>
              </div>
            </DropdownMenuLabel>
          </>
        )}
        <DropdownMenuSeparator />
        {extendedUser?.role === "authority" && (
          <DropdownMenuItem>
            <Shield className="w-4 h-4 mr-2" />
            Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
