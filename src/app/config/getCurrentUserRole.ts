import type { UserType } from "../../features/user/user";

export const getCurrentUser = (): UserType | null => {
    const userType = localStorage.getItem("userType");
    if (!userType) {
        return null;
    }
    return userType as UserType;
};
export const getCurrentUserRole = (): UserType | null => {
    return getCurrentUser();
};
export const isSuperAdmin = (): boolean => {
    return getCurrentUserRole() === "SUPER_ADMIN";
};
export const isTenantAdmin = (): boolean => {
    return getCurrentUserRole() === "TENANT_ADMIN";
};
export const isVendor = (): boolean => {
    return getCurrentUserRole() === "VENDOR";
};
