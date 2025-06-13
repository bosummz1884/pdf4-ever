import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Shield, Lock, Edit3, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      data-oid="pvhlu6h"
    >
      {/* Header */}
      <header
        className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50"
        data-oid="ix0ezrr"
      >
        <div
          className="container mx-auto px-4 py-4 flex items-center justify-between"
          data-oid="3f7d:ya"
        >
          <div className="flex items-center space-x-3" data-oid="-5igi5q">
            <img
              src="/assets/70x70logo.png"
              alt="PDF4EVER Logo"
              className="h-10 w-10"
              data-oid="whnzmtk"
            />

            <span
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
              data-oid="on41yqf"
            >
              PDF4EVER
            </span>
          </div>
          <div className="flex items-center space-x-4" data-oid="whree3-">
            <Button variant="ghost" asChild data-oid="lt5i_cy">
              <a href="/home" data-oid=".5eu4ew">
                Sign In
              </a>
            </Button>
            <Button asChild data-oid="ex9wz85">
              <a href="/home" data-oid="ee134_0">
                Get Started
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="container mx-auto px-4 py-20 text-center"
        data-oid="4mb28r9"
      >
        <div className="max-w-4xl mx-auto" data-oid="uuequm.">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
            data-oid="fk7u7lh"
          >
            Edit PDFs with Complete Privacy
          </h1>
          <p
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            data-oid="z89z-wv"
          >
            Professional PDF editing tools that work entirely in your browser.
            Your files never leave your device - guaranteed privacy protection.
          </p>
          <div className="flex justify-center" data-oid="36ks3ea">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              asChild
              data-oid="eo3.82l"
            >
              <a href="/home" data-oid=":qhtgs5">
                Start Editing for Free
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why PDF4EVER Section */}
      <section className="container mx-auto px-4 py-16" data-oid="q-n4rb3">
        <h2 className="text-3xl font-bold text-center mb-12" data-oid="--1djr6">
          Why Choose PDF4EVER?
        </h2>
        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          data-oid="qjiwn1-"
        >
          <Card className="text-center p-6" data-oid="pb-dah6">
            <CardContent className="pt-6" data-oid="ylkpc_b">
              <Shield
                className="h-12 w-12 text-blue-600 mx-auto mb-4"
                data-oid="u6y-fio"
              />
              <h3 className="text-xl font-semibold mb-2" data-oid="t057kt7">
                Complete Privacy
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300"
                data-oid="sseph:x"
              >
                All processing happens locally. We never store your files on our
                servers.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6" data-oid="55x.pr8">
            <CardContent className="pt-6" data-oid="rxn1jip">
              <Lock
                className="h-12 w-12 text-purple-600 mx-auto mb-4"
                data-oid="k_t4vk8"
              />
              <h3 className="text-xl font-semibold mb-2" data-oid="6votb4y">
                Data Respect
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300"
                data-oid="5m5pcfe"
              >
                Your personal information is never shared with third parties. We
                protect your privacy above all.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6" data-oid="..v684g">
            <CardContent className="pt-6" data-oid="d4tled7">
              <Edit3
                className="h-12 w-12 text-orange-500 mx-auto mb-4"
                data-oid="_zremhm"
              />
              <h3 className="text-xl font-semibold mb-2" data-oid="77u190k">
                Professional Tools
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300"
                data-oid="mg6:udf"
              >
                Advanced editing, annotations, signatures, OCR, and form filling
                capabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6" data-oid="fl-mm7k">
            <CardContent className="pt-6" data-oid="6l8fpvn">
              <Zap
                className="h-12 w-12 text-green-600 mx-auto mb-4"
                data-oid="yty46j8"
              />
              <h3 className="text-xl font-semibold mb-2" data-oid="hwflcji">
                Lightning Fast
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300"
                data-oid="zaskf7q"
              >
                No uploads, no waiting. Start editing immediately in your
                browser.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features List */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16" data-oid="4v746ga">
        <div className="container mx-auto px-4" data-oid="xjg5omi">
          <h2
            className="text-3xl font-bold text-center mb-12"
            data-oid="jqi4ul2"
          >
            Everything You Need
          </h2>
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-oid="quc14:t"
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
                data-oid="3oqjkzh"
              >
                <div
                  className="h-2 w-2 bg-blue-600 rounded-full"
                  data-oid="5mv71j5"
                ></div>
                <span
                  className="text-gray-700 dark:text-gray-300"
                  data-oid="oqsm389"
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
        data-oid="hf4sjck"
      >
        <div className="max-w-3xl mx-auto" data-oid="67e:19r">
          <Shield
            className="h-16 w-16 text-blue-600 mx-auto mb-6"
            data-oid="264k8xb"
          />
          <h2 className="text-3xl font-bold mb-4" data-oid="p2yaz2i">
            Your Privacy is Sacred
          </h2>
          <p
            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            data-oid="hx_v4d6"
          >
            We believe your documents should remain yours. That's why PDF4EVER
            processes everything locally in your browser. No file uploads, no
            cloud storage, no data collection. Just pure, secure PDF editing.
          </p>
          <div
            className="flex justify-center items-center space-x-8 text-sm text-gray-500 dark:text-gray-400"
            data-oid="zl1fgfm"
          >
            <div data-oid="nma31e-">✓ No file uploads</div>
            <div data-oid="tm7y0gu">✓ No cloud storage</div>
            <div data-oid="losqsnl">✓ No tracking</div>
            <div data-oid="_r2ns:j">✓ 100% local processing</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="bg-gradient-to-r from-blue-600 to-orange-500 py-16 text-white"
        data-oid="041wbct"
      >
        <div className="container mx-auto px-4 text-center" data-oid="31qvl43">
          <h2 className="text-3xl font-bold mb-4" data-oid="707rd:j">
            Ready to Start Editing?
          </h2>
          <p className="text-xl opacity-90 mb-8" data-oid="7wg05jk">
            Join thousands of users who trust PDF4EVER for secure document
            editing.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
            asChild
            data-oid="_si9n0q"
          >
            <a href="/home" data-oid=":uamzjk">
              Start Now
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8" data-oid="tgom.fe">
        <div className="container mx-auto px-4 text-center" data-oid="qif_8pg">
          <div
            className="flex items-center justify-center space-x-3 mb-4"
            data-oid="g9_3m_d"
          >
            <img
              src="/assets/70x70logo.png"
              alt="PDF4EVER Logo"
              className="h-8 w-8"
              data-oid="qt:ja-k"
            />

            <span className="text-xl font-bold" data-oid=":61q7_u">
              PDF4EVER
            </span>
          </div>
          <div
            className="flex justify-center space-x-6 mb-4 text-sm"
            data-oid="3xnhd0l"
          >
            <a
              href="/privacy-policy"
              className="text-gray-300 hover:text-white transition-colors"
              data-oid="jb2_ypl"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-gray-300 hover:text-white transition-colors"
              data-oid="_k1aydb"
            >
              Terms of Service
            </a>
          </div>
          <p className="text-gray-400" data-oid="v-xrty:">
            © 2024 PDF4EVER. Privacy-first PDF editing for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
