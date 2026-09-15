import { animations } from "@/components/registry";

// The hero (orbit rings) is served at "/".
export default function Page() {
  const Hero = animations["home"];
  return <Hero />;
}
