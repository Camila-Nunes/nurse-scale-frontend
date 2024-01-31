import { toast } from "react-toastify";

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('jwtToken');
    return !!token;
};