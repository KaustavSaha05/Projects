"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryClient = exports.getQueryFn = void 0;
exports.apiRequest = apiRequest;
const react_query_1 = require("@tanstack/react-query");
// Helper function to handle API errors
async function throwIfResNotOk(res) {
    if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
    }
}
// Generic API request function for making HTTP requests
async function apiRequest(method, url, data) {
    const res = await fetch(url, {
        method,
        headers: data ? { "Content-Type": "application/json" } : {},
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include", // Important for sending cookies with requests
    });
    await throwIfResNotOk(res);
    return res;
}
// Query function factory for TanStack Query
const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
    const res = await fetch(queryKey[0], {
        credentials: "include",
    });
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
    }
    await throwIfResNotOk(res);
    return await res.json();
};
exports.getQueryFn = getQueryFn;
// Configure and export the QueryClient instance
exports.queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            queryFn: (0, exports.getQueryFn)({ on401: "throw" }), // Default to throwing on 401
            refetchInterval: false, // Don't automatically refetch
            refetchOnWindowFocus: false, // Don't refetch when window gains focus
            staleTime: Infinity, // Data never goes stale automatically
            retry: false, // Don't retry failed requests
        },
        mutations: {
            retry: false, // Don't retry failed mutations
        },
    },
});
