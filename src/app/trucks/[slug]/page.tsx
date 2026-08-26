import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TruckSeriesPage } from "@/components/trucks/TruckSeriesPage";
import { officialAssets } from "@/content/assets";
import { getPublicTruckSeries, publicTruckSeries, type TruckImageKey, type TruckSeriesSlug } from "@/content/trucks";

interface SeriesRouteProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return publicTruckSeries.map(({ slug }) => ({ slug }));
}

function isTruckSeriesSlug(value: string): value is TruckSeriesSlug {
  return publicTruckSeries.some(({ slug }) => slug === value);
}

function imageFields(imageKey: TruckImageKey) {
  const asset = officialAssets[imageKey];
  return { src: asset.src, alt: asset.alt, width: asset.width, height: asset.height };
}

export async function generateMetadata({ params }: SeriesRouteProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isTruckSeriesSlug(slug)) return {};
  const series = getPublicTruckSeries(slug);
  return series ? { title: `${series.name} | Hino Cebu`, description: series.description } : {};
}

export default async function TruckSeriesRoute({ params }: SeriesRouteProps) {
  const { slug } = await params;
  if (!isTruckSeriesSlug(slug)) notFound();

  const series = getPublicTruckSeries(slug);
  if (!series) notFound();

  return <TruckSeriesPage image={imageFields(series.imageKey)} series={series} />;
}
