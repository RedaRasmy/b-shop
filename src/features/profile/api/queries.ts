import { fetchAddresses, fetchMe } from "@/features/profile/api/requests"
import { profileKeys } from "@/features/profile/query-keys"
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
