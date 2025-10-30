import { fetchAddresses } from "@/features/profile/api/requests"
import { profileKeys } from "@/features/profile/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useAddresses() {
    return useQuery({
        queryKey: profileKeys.addresses(),
        queryFn: () => fetchAddresses(),
    })
}