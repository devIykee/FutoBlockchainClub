import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about FUTO Blockchain Club - our vision, mission, and values.",
};

export default function AboutPage() {
  return <AboutClient />;
}