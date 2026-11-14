import { ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const gameUrl = `${import.meta.env.BASE_URL}labs/ar-blob-test.html`;

const KazukiLabs = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navigation />
    <main className="container mx-auto px-4 pb-10 pt-28 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl sm:text-5xl">KazukiLabs</h1>
        <Button asChild variant="outline">
          <a href={gameUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden="true" /> Open full screen
          </a>
        </Button>
      </div>
      <iframe
        src={gameUrl}
        title="AR Blob Test"
        allow="camera; xr-spatial-tracking; fullscreen"
        allowFullScreen
        className="block h-[max(680px,calc(100dvh-200px))] w-full border-0"
      />
    </main>
    <Footer />
  </div>
);

export default KazukiLabs;