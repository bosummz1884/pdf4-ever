import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Upload,
  FileText,
  Edit3,
  Download,
  Merge,
  Split,
  Shield,
  Zap,
  Eye,
  Users,
  Star,
  Check,
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Heart,
  Globe,
  Lock,
  Clock,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted?: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      data-oid="5n6jw73"
    >
      {/* Header */}
      <header
        className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50"
        data-oid="er-p5v1"
      >
        <div className="container mx-auto px-4 py-4" data-oid="hqi0drx">
          <div className="flex items-center justify-between" data-oid="g0rme8o">
            <div className="flex items-center gap-2" data-oid="07odke2">
              <div
                className="bg-blue-600 text-white p-2 rounded-lg"
                data-oid="_qr4fs9"
              >
                <FileText className="h-6 w-6" data-oid="skx2939" />
              </div>
              <span className="text-xl font-bold" data-oid="_n9fuds">
                PDF4EVER
              </span>
              <Badge variant="secondary" data-oid="l.-71-a">
                Free
              </Badge>
            </div>

            <nav
              className="hidden md:flex items-center gap-6"
              data-oid="pvpb_22"
            >
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                data-oid=".texag6"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                data-oid="m55mz:r"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                data-oid="s.nliip"
              >
                About
              </a>
              <AuthDialogs
                trigger={
                  <Button variant="outline" data-oid="ehj:nd:">
                    Sign In
                  </Button>
                }
                data-oid="3ka.pwx"
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4" data-oid="xq.-.-v">
        <div className="container mx-auto text-center" data-oid="yhwc40e">
          <div className="max-w-4xl mx-auto" data-oid="06ftg2x">
            <h1
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              data-oid="k5a00ir"
            >
              The Ultimate
              <span
                className="text-blue-600 dark:text-blue-400"
                data-oid="0he6mp7"
              >
                {" "}
                PDF Editor
              </span>
              <br data-oid="1jig13f" />
              You'll Ever Need
            </h1>

            <p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              data-oid="ncx2zke"
            >
              Edit, merge, split, annotate, and transform your PDFs with our
              powerful, privacy-first editor. No downloads required, works
              entirely in your browser.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              data-oid="tmbun3-"
            >
              <Button
                size="lg"
                className="text-lg px-8 py-3"
                onClick={onGetStarted}
                data-oid="ebtj-jz"
              >
                <Upload className="h-5 w-5 mr-2" data-oid="4lyfhbh" />
                Start Editing Now
              </Button>

              <AuthDialogs
                defaultTab="signup"
                trigger={
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-3"
                    data-oid="-_09.ws"
                  >
                    Create Free Account
                    <ArrowRight className="h-5 w-5 ml-2" data-oid="njdu4sx" />
                  </Button>
                }
                data-oid=":zk-5ri"
              />
            </div>

            <div
              className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
              data-oid="coa-2dr"
            >
              <div className="flex items-center gap-2" data-oid="diuq-ia">
                <Shield className="h-4 w-4" data-oid="hd5hw6s" />
                Privacy First
              </div>
              <div className="flex items-center gap-2" data-oid="cfnwc3b">
                <Zap className="h-4 w-4" data-oid="2v9mqxs" />
                Lightning Fast
              </div>
              <div className="flex items-center gap-2" data-oid="t6vi-uf">
                <Globe className="h-4 w-4" data-oid="gssqnnu" />
                Works Offline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 bg-white dark:bg-gray-800"
        data-oid="e28c2f2"
      >
        <div className="container mx-auto" data-oid="nmn.vrx">
          <div className="text-center mb-16" data-oid="3b892p9">
            <h2
              className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
              data-oid="-qfxuug"
            >
              Everything You Need for PDF Editing
            </h2>
            <p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              data-oid="12423k-"
            >
              Comprehensive tools for all your PDF needs, from basic editing to
              advanced annotations
            </p>
          </div>

          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-oid="ao0xo6x"
          >
            {[
              {
                icon: Edit3,
                title: "Rich Text Editing",
                description:
                  "Add, edit, and format text with full control over fonts, colors, and styling",
              },
              {
                icon: Eye,
                title: "Form Filling",
                description:
                  "Detect and fill PDF forms automatically with smart field recognition",
              },
              {
                icon: Merge,
                title: "Merge & Split",
                description:
                  "Combine multiple PDFs or split large documents into smaller files",
              },
              {
                icon: FileText,
                title: "OCR Text Recognition",
                description:
                  "Extract text from scanned documents with advanced OCR technology",
              },
              {
                icon: Shield,
                title: "Privacy Protected",
                description:
                  "All processing happens in your browser - your files never leave your device",
              },
              {
                icon: Download,
                title: "Multiple Export Options",
                description:
                  "Save as PDF, export text, or download individual pages",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow"
                data-oid="grxb8cs"
              >
                <CardHeader data-oid="_3u8efp">
                  <feature.icon
                    className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4"
                    data-oid="yp-u_44"
                  />

                  <CardTitle data-oid="y0s3i51">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent data-oid="t--6mwe">
                  <p
                    className="text-gray-600 dark:text-gray-300"
                    data-oid="hzrf.gm"
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4" data-oid="thzigjh">
        <div className="container mx-auto" data-oid="yeyr7yy">
          <div
            className="grid md:grid-cols-4 gap-8 text-center"
            data-oid="yh:6d-o"
          >
            {[
              { number: "1M+", label: "Documents Processed" },
              { number: "50K+", label: "Happy Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "0", label: "Data Stored" },
            ].map((stat, index) => (
              <div key={index} data-oid="2wlupw:">
                <div
                  className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"
                  data-oid="g9ksl8b"
                >
                  {stat.number}
                </div>
                <div
                  className="text-gray-600 dark:text-gray-300"
                  data-oid="8f9leq2"
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 px-4 bg-gray-50 dark:bg-gray-900"
        data-oid="59fu9gw"
      >
        <div className="container mx-auto" data-oid="euldlxl">
          <div className="text-center mb-16" data-oid="mk:vndk">
            <h2
              className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
              data-oid="bp6q1lk"
            >
              Simple, Transparent Pricing
            </h2>
            <p
              className="text-xl text-gray-600 dark:text-gray-300"
              data-oid="l4cxu_7"
            >
              Choose the plan that works best for you
            </p>
          </div>

          <div
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            data-oid="q:o-1ak"
          >
            {/* Free Plan */}
            <Card className="relative" data-oid="3zr_un9">
              <CardHeader data-oid="_l6ih5.">
                <CardTitle className="text-2xl" data-oid=":4s:q21">
                  Free Forever
                </CardTitle>
                <div className="text-4xl font-bold" data-oid="yn89gla">
                  $0
                </div>
                <p
                  className="text-gray-600 dark:text-gray-300"
                  data-oid="-qbz91v"
                >
                  Perfect for personal use
                </p>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="-62o3s:">
                {[
                  "Upload files up to 10MB",
                  "Basic editing tools",
                  "Form filling",
                  "Text extraction",
                  "Browser-based processing",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                    data-oid="lrtanvx"
                  >
                    <Check
                      className="h-5 w-5 text-green-500"
                      data-oid="bkkg.9m"
                    />

                    <span data-oid="hxnd2nc">{feature}</span>
                  </div>
                ))}
                <Button
                  className="w-full mt-6"
                  onClick={onGetStarted}
                  data-oid="0n0sew8"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card
              className="relative border-blue-500 shadow-lg"
              data-oid="evbww4k"
            >
              <div
                className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                data-oid="s3cqlop"
              >
                <Badge className="bg-blue-600" data-oid="vhvci0w">
                  Most Popular
                </Badge>
              </div>
              <CardHeader data-oid="hapjm9a">
                <CardTitle className="text-2xl" data-oid="dnz4p5v">
                  Pro
                </CardTitle>
                <div className="text-4xl font-bold" data-oid="gwkzm:3">
                  $9
                  <span className="text-lg" data-oid="huhqyj1">
                    /month
                  </span>
                </div>
                <p
                  className="text-gray-600 dark:text-gray-300"
                  data-oid="o-5z4b7"
                >
                  For power users and professionals
                </p>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="vg71vte">
                {[
                  "Everything in Free",
                  "Upload files up to 100MB",
                  "Advanced annotation tools",
                  "Batch processing",
                  "OCR in 10+ languages",
                  "Priority support",
                  "Cloud sync (optional)",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                    data-oid="._feq07"
                  >
                    <Check
                      className="h-5 w-5 text-green-500"
                      data-oid="kzx2pwj"
                    />

                    <span data-oid="fgr2avx">{feature}</span>
                  </div>
                ))}
                <AuthDialogs
                  defaultTab="signup"
                  trigger={
                    <Button className="w-full mt-6" data-oid="z-aufhc">
                      Start Pro Trial
                    </Button>
                  }
                  data-oid="o364xfb"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section
        className="py-16 px-4 bg-blue-50 dark:bg-blue-900/20"
        data-oid=":bpnjdq"
      >
        <div className="container mx-auto text-center" data-oid="v78e_yb">
          <div className="max-w-3xl mx-auto" data-oid="070yhra">
            <Shield
              className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-6"
              data-oid="b9cf.sv"
            />

            <h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              data-oid="gbp77hq"
            >
              Your Privacy is Our Priority
            </h2>
            <p
              className="text-lg text-gray-600 dark:text-gray-300 mb-6"
              data-oid="r2dcy1a"
            >
              Unlike other PDF editors, we process everything in your browser.
              Your documents never leave your device, ensuring complete privacy
              and security.
            </p>
            <div
              className="flex items-center justify-center gap-8 text-sm"
              data-oid="gxa:1sg"
            >
              <div className="flex items-center gap-2" data-oid="qa390im">
                <Lock className="h-4 w-4 text-green-500" data-oid="or3f1-l" />
                Client-side processing
              </div>
              <div className="flex items-center gap-2" data-oid="vm.br93">
                <Eye className="h-4 w-4 text-green-500" data-oid="1arbyun" />
                No data collection
              </div>
              <div className="flex items-center gap-2" data-oid="u:wvz:o">
                <Clock className="h-4 w-4 text-green-500" data-oid="nic2:c3" />
                Works offline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        data-oid="ffwy:ye"
      >
        <div className="container mx-auto text-center" data-oid="9.uk3u_">
          <h2 className="text-4xl font-bold mb-4" data-oid="mkcvl8f">
            Ready to Transform Your PDF Workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90" data-oid="10gczhg">
            Join thousands of users who trust PDF4EVER for their document needs
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-oid="z8uzogg"
          >
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-3"
              onClick={onGetStarted}
              data-oid="5.rtht8"
            >
              Start Editing Now
            </Button>
            <AuthDialogs
              defaultTab="signup"
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
                  data-oid="_-48784"
                >
                  Create Free Account
                </Button>
              }
              data-oid="c_xdt7p"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="bg-gray-900 text-white py-12 px-4"
        data-oid="cmvassq"
      >
        <div className="container mx-auto" data-oid="x3lg:al">
          <div className="grid md:grid-cols-4 gap-8" data-oid="cvbjae-">
            <div data-oid="cbm:nvg">
              <div className="flex items-center gap-2 mb-4" data-oid="pheviua">
                <div
                  className="bg-blue-600 text-white p-2 rounded-lg"
                  data-oid="n3uen.q"
                >
                  <FileText className="h-6 w-6" data-oid="9um3fwt" />
                </div>
                <span className="text-xl font-bold" data-oid="rm6ba8n">
                  PDF4EVER
                </span>
              </div>
              <p className="text-gray-400 mb-4" data-oid="qy31xdn">
                The most powerful PDF editor that respects your privacy.
              </p>
              <div className="flex gap-4" data-oid="s1s6lt6">
                <Button size="sm" variant="ghost" data-oid="z1doj8x">
                  <Github className="h-4 w-4" data-oid="3:ru.qh" />
                </Button>
                <Button size="sm" variant="ghost" data-oid="_m6jkin">
                  <Twitter className="h-4 w-4" data-oid="3om2mj-" />
                </Button>
                <Button size="sm" variant="ghost" data-oid="cygt-j1">
                  <Mail className="h-4 w-4" data-oid="b5m-62n" />
                </Button>
              </div>
            </div>

            <div data-oid="z:tuhwl">
              <h4 className="font-semibold mb-4" data-oid="wft.fqy">
                Features
              </h4>
              <div className="space-y-2 text-gray-400" data-oid="1kmz708">
                <div data-oid="upctadk">PDF Editor</div>
                <div data-oid=".kitbbf">Form Filling</div>
                <div data-oid="uowcgxi">Text Recognition</div>
                <div data-oid="j528n5c">Merge & Split</div>
                <div data-oid="k426h.8">Annotations</div>
              </div>
            </div>

            <div data-oid="3dwyo_f">
              <h4 className="font-semibold mb-4" data-oid="e-.c2ve">
                Resources
              </h4>
              <div className="space-y-2 text-gray-400" data-oid="hy1fll0">
                <div data-oid="53a.vj3">Documentation</div>
                <div data-oid="30yv8wb">API Reference</div>
                <div data-oid="ooj-zpk">Tutorials</div>
                <div data-oid="jnv99-r">Blog</div>
                <div data-oid="t.qbs5l">Support</div>
              </div>
            </div>

            <div data-oid="xs8wr9e">
              <h4 className="font-semibold mb-4" data-oid="vb3a73:">
                Company
              </h4>
              <div className="space-y-2 text-gray-400" data-oid="cs1am-w">
                <div data-oid="83ks5wf">About Us</div>
                <div data-oid="ww3ss-h">Privacy Policy</div>
                <div data-oid="cf0js23">Terms of Service</div>
                <div data-oid="9gzjflt">Contact</div>
                <div data-oid=":lww817">Careers</div>
              </div>
            </div>
          </div>

          <div
            className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
            data-oid="ja.ob_o"
          >
            <p data-oid="60sny:2">
              © 2024 PDF4EVER. Made with{" "}
              <Heart
                className="h-4 w-4 inline text-red-500"
                data-oid="pgbf3s3"
              />{" "}
              for document lovers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
