import { notFound } from "next/navigation";
import { animations } from "@/components/registry";

export function generateStaticParams() {
  return Object.keys(animations)
    .filter((slug) => slug !== "home")
    .map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const Animation = animations[slug];
  if (!Animation) notFound();
  return <Animation />;
}
