import { useParams } from "react-router-dom"

export default function OrderDetailsPage() {
    const id = useParams().id
    return <div>order details : {id}</div>
}
