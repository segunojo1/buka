'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import authService from "@/services/auth.service";
import useAppStore from "@/store/app.store";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileDrop = () => {
    const {logout} = useAppStore()
    const route = useRouter()
    const handleLogout = () => {
        authService.logout()
        // logout()
        route.push('/auth/login')
    }
  return (
    <div>
        <DropdownMenu>
  <DropdownMenuTrigger>
    <User />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
    </div>
  )
}

export default ProfileDrop