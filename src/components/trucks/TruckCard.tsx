import Link from "next/link";
import Image from "next/image";

export type TruckCardItem = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  heroImage: string;
};

export function TruckCard({ truck }: { truck: TruckCardItem }) {
  return <article className="card truck-card"><div className="official-image"><Image src={truck.heroImage} alt={`${truck.name} Series official Hino Motors Philippines product image`} fill sizes="(max-width: 719px) calc(100vw - 32px), (max-width: 1059px) calc(50vw - 36px), 33vw" /></div><div className="card-body"><span className="card-kicker">{truck.category}</span><h3>{truck.name}</h3><p>{truck.summary}</p><Link className="text-link" href={`/trucks/${truck.slug}`}>Explore {truck.name} <span aria-hidden>→</span></Link></div></article>;
}
