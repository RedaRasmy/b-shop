import {
    fetchAddresses,
    fetchCustomers,
    fetchMe,
} from "@/features/profile/api/requests"
import { profileKeys, type CustomersQuery } from "@/features/profile/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useProfile() {
    return useQuery({
        queryKey: profileKeys.me(),
        queryFn: fetchMe,
    })
}

export function useAddresses() {
    return useQuery({
        queryKey: profileKeys.addresses(),
        queryFn: fetchAddresses,
    })
}

export function useCustomers(query?: CustomersQuery) {
    return useQuery({
        queryKey: profileKeys.customers(query),
        queryFn: () => fetchCustomers(query),
    })
}
