import { Button } from "./ui/button";

export default function CTASection() {
  const handleStartFree = () => {
    console.log("Start Free Today clicked");
  };

  const handleTutorial = () => {
    console.log("Tutorial clicked");
  };

  return (
    <section
      className="py-20 bg-gradient-to-r from-primary to-accent"
      data-oid="-kt5jcm"
    >
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        data-oid="g:a3f:p"
      >
        <h2
          className="text-3xl sm:text-4xl font-bold text-white mb-6"
          data-oid="hlkaqt."
        >
          Ready to Transform Your PDF Workflow?
        </h2>
        <p
          className="text-xl text-orange-100 mb-8 leading-relaxed"
          data-oid="jj.ve7:"
        >
          Join thousands of users who trust{" "}
          <span className="text-orange-200" data-oid="em_251a">
            PDF
          </span>
          <span className="text-white" data-oid="freqe3c">
            4EVER
          </span>{" "}
          for their document needs.
        </p>
        <div className="flex justify-center" data-oid="n5yxqij">
          <Button
            variant="outline"
            onClick={handleTutorial}
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 bg-transparent"
            data-oid="inv:blc"
          >
            Tutorial
          </Button>
        </div>
      </div>
    </section>
  );
}
