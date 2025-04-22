import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/context/globalContext";
import { Badge } from "./ui/badge";
import axios from "axios";

function Profile() {
  const { userProfile, isAuthenticated } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("/api/v1/logout");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <DropdownMenu>
      <div className="flex items-center gap-4">
        <Badge>{userProfile?.profession}</Badge>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <img
            src={userProfile?.profilePicture ? userProfile?.profilePicture : "/user.png"}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-lg"
          />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        {isAuthenticated ? (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Login</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;