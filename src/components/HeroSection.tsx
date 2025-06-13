import { Button } from "./ui/button";
import { Rocket, Play } from "lucide-react";

export default function HeroSection() {
  const handleGetStarted = () => {
    console.log("Get Started clicked");
  };

  const handleTutorial = () => {
    console.log("Tutorial clicked");
  };

  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-background to-muted dark:from-background dark:to-card overflow-hidden"
      data-oid="xezr3oq"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32"
        data-oid="78nijw."
      >
        <div className="text-center" data-oid="pwiocop">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 text-center"
            data-oid="j18yrzg"
          >
            Premium Online{" "}
            <span className="text-primary bg-transparent" data-oid="p17_y57">
              PDF
            </span>{" "}
            Editing Capabilities
          </h1>
          <div
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
            data-oid="d7d8ud."
          >
            <ul className="space-y-2 mb-8" data-oid="_pdymxw">
              <li data-oid="-ll::2f">• Inline Text Edit</li>
              <li data-oid="255gxf0">• Font Match</li>
              <li data-oid="4_qir6a">• OCR Text Extractor</li>
              <li data-oid="hz4oo1g">• Invoice Generator</li>
              <li data-oid=".q.aklm">• E-Sign</li>
            </ul>
          </div>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            data-oid="vlc_4bd"
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              data-oid="fo_ak8d"
            >
              Start Free Today
            </Button>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        data-oid="vy8:bex"
      >
        <div
          className="absolute top-20 left-20 w-20 h-20 bg-primary rounded-full animate-float"
          data-oid="hh:v6oy"
        ></div>
        <div
          className="absolute top-40 right-32 w-16 h-16 bg-accent rounded-full animate-float-delay"
          data-oid="bdhggq8"
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-12 h-12 bg-primary rounded-full animate-float-delay-2"
          data-oid="7te42y1"
        ></div>
      </div>
    </section>
  );
}
