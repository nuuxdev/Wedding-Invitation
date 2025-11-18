import { useParams } from "react-router-dom";

export default function Guest() {
  const { id } = useParams();
  return <div>Hello {id}</div>;
}
