import Link from "next/link";
import Image from "next/image";
import type { Truck } from "@/content/trucks";

export function TruckCard({ truck }: { truck: Truck }) {
  return <article className="card truck-card"><div className="official-image"><Image src={truck.heroImage} alt={`${truck.name} Series official Hino Motors Philippines product image`} fill sizes="(max-width: 720px) 100vw, 33vw" /></div><div className="card-body"><span className="card-kicker">{truck.category}</span><h3>{truck.name}</h3><p>{truck.summary}</p><Link className="text-link" href={`/trucks/${truck.slug}`}>Explore {truck.name} <span aria-hidden>→</span></Link></div></article>;
}
