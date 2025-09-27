import { useParams } from "react-router-dom"

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>() 

  return <div>Product slug: {slug}</div>
}
