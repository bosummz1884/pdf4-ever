import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Shield, Lock, Edit3, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      data-oid="z1ea8gk"
    >
      {/* Header */}
      <header
        className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50"
        data-oid=".p3x_0v"
      >
        <div
          className="container mx-auto px-4 py-4 flex items-center justify-between"
          data-oid="_.cvgr1"
        >
          <div className="flex items-center space-x-3" data-oid="k67j:m3">
            <img
              src="/assets/70x70logo.png"
              alt="PDF4EVER Logo"
              className="h-10 w-10"
              data-oid="qytwvz0"
            />

            <span
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
              data-oid="od_p2yy"
            >
              PDF4EVER
            </span>
          </div>
          <div className="flex items-center space-x-4" data-oid="13pncor">
            <Button variant="ghost" asChild data-oid="05tme8f">
              <a href="/home" data-oid="99_gu2u">
                Sign In
              </a>
            </Button>
            <Button asChild data-oid="2blo2n8">
              <a href="/home" data-oid="ebip-.z">
                Get Started
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="container mx-auto px-4 py-20 text-center"
        data-oid="2xq9vl5"
      >
        <div className="max-w-4xl mx-auto" data-oid="9eimbgc">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
            data-oid="bl1cp3l"
          >
            Edit PDFs with Complete Privacy
          </h1>
          <p
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            data-oid="mu1ga8z"
          >
            Professional PDF editing tools that work entirely in your browser.
            Your files never leave your device - guaranteed privacy protection.
          </p>
          <div className="flex justify-center" data-oid="x-x8n1k">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              asChild
              data-oid="aii0z0i"
            >
              <a href="/home" data-oid="iyjc4cz">
                Start Editing for Free
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why PDF4EVER Section */}
      <section className="container mx-auto px-4 py-16" data-oid="ak-g72e">
        <h2 className="text-3xl font-bold text-center mb-12" data-oid="4tpcxyv">
          Why Choose PDF4EVER?
        </h2>
        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          data-oid="3zqorh6"
        >
          <Card className="text-center p-6" data-oid="3lojzs1">
            <CardContent className="pt-6" data-oid=".jrb793">
              <Shield
                className="h-12 w-12 text-blue-600 mx-auto mb-4"
                data-oid="4.yd5c0"
              />

              <h3 className="text-xl font-semibold mb-2" data-oid="rgcpeq_">
                Complete Privacy
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300"
                data-oid="do4fz1:"
              >
                All processing happens locally. We never store your files on our
                servers.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6" data-oid="8t2d-kc">
            <CardContent className="pt-6" data-oid="48so_wz">
              <Lock
                className="h-12 w-12 text-purple-600 mx-auto mb-4"
                data-oid="yq3xwpg"
              />

              <h3 className="text-xl font-semibold mb-2" data-oid="vy2yhwi">
                Data Respect
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300"
                data-oid="vgpinz9"
              >
                Your personal information is never shared with third parties. We
                protect your privacy above all.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6" data-oid="t-8e06q">
            <CardContent className="pt-6" data-oid="s-.u_tc">
              <Edit3
                className="h-12 w-12 text-orange-500 mx-auto mb-4"
                data-oid="u-:_j3_"
              />

              <h3 className="text-xl font-semibold mb-2" data-oid="8_sby_.">
                Professional Tools
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300"
                data-oid=":ql4aqx"
              >
                Advanced editing, annotations, signatures, OCR, and form filling
                capabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6" data-oid="w27-l6q">
            <CardContent className="pt-6" data-oid="x4a2vc9">
              <Zap
                className="h-12 w-12 text-green-600 mx-auto mb-4"
                data-oid="ij81eu:"
              />

              <h3 className="text-xl font-semibold mb-2" data-oid="p953h7x">
                Lightning Fast
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300"
                data-oid="137fnna"
              >
                No uploads, no waiting. Start editing immediately in your
                browser.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features List */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16" data-oid="wacd_g3">
        <div className="container mx-auto px-4" data-oid="qxsl2zx">
          <h2
            className="text-3xl font-bold text-center mb-12"
            data-oid="ke9pue8"
          >
            Everything You Need
          </h2>
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-oid="0f5y5jm"
          >
            {[
              "Text editing and formatting",
              "Digital signatures",
              "Form filling",
              "OCR text extraction",
              "Page merging and splitting",
              "Annotation tools",
              "Font matching",
              "Invoice generation",
              "Watermark removal",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3"
                data-oid=".6133mn"
              >
                <div
                  className="h-2 w-2 bg-blue-600 rounded-full"
                  data-oid="8_zqd:j"
                ></div>
                <span
                  className="text-gray-700 dark:text-gray-300"
                  data-oid="c3b9zmj"
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Guarantee */}
      <section
        className="container mx-auto px-4 py-16 text-center"
        data-oid="sn6br9_"
      >
        <div className="max-w-3xl mx-auto" data-oid="_d_p9j_">
          <Shield
            className="h-16 w-16 text-blue-600 mx-auto mb-6"
            data-oid="-w603fv"
          />

          <h2 className="text-3xl font-bold mb-4" data-oid="xocahle">
            Your Privacy is Sacred
          </h2>
          <p
            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            data-oid="u_rldin"
          >
            We believe your documents should remain yours. That's why PDF4EVER
            processes everything locally in your browser. No file uploads, no
            cloud storage, no data collection. Just pure, secure PDF editing.
          </p>
          <div
            className="flex justify-center items-center space-x-8 text-sm text-gray-500 dark:text-gray-400"
            data-oid=".d-w58y"
          >
            <div data-oid="iw:o6ca">✓ No file uploads</div>
            <div data-oid=":_59udl">✓ No cloud storage</div>
            <div data-oid="or57z2i">✓ No tracking</div>
            <div data-oid="iiq9uwi">✓ 100% local processing</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="bg-gradient-to-r from-blue-600 to-orange-500 py-16 text-white"
        data-oid="e2pc.cp"
      >
        <div className="container mx-auto px-4 text-center" data-oid="m:wyw8f">
          <h2 className="text-3xl font-bold mb-4" data-oid="jj3dxx-">
            Ready to Start Editing?
          </h2>
          <p className="text-xl opacity-90 mb-8" data-oid="vdy5f6g">
            Join thousands of users who trust PDF4EVER for secure document
            editing.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
            asChild
            data-oid="0.od3ep"
          >
            <a href="/home" data-oid="og_.bik">
              Start Now
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8" data-oid="s026y-v">
        <div className="container mx-auto px-4 text-center" data-oid="notq7kn">
          <div
            className="flex items-center justify-center space-x-3 mb-4"
            data-oid="v3z22et"
          >
            <img
              src="/assets/70x70logo.png"
              alt="PDF4EVER Logo"
              className="h-8 w-8"
              data-oid="_an6skh"
            />

            <span className="text-xl font-bold" data-oid="xxbtxlb">
              PDF4EVER
            </span>
          </div>
          <div
            className="flex justify-center space-x-6 mb-4 text-sm"
            data-oid="1hsm.j9"
          >
            <a
              href="/privacy-policy"
              className="text-gray-300 hover:text-white transition-colors"
              data-oid="p7yfts3"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-gray-300 hover:text-white transition-colors"
              data-oid="0j.c8xh"
            >
              Terms of Service
            </a>
          </div>
          <p className="text-gray-400" data-oid="b41gx8k">
            © 2024 PDF4EVER. Privacy-first PDF editing for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
