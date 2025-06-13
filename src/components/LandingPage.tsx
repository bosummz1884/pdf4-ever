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
      data-oid="x7wujyi"
    >
      {/* Header */}
      <header
        className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50"
        data-oid="uej._p9"
      >
        <div className="container mx-auto px-4 py-4" data-oid="tcqc7g5">
          <div className="flex items-center justify-between" data-oid="7my3.oi">
            <div className="flex items-center gap-2" data-oid="8c-bhj6">
              <div
                className="bg-blue-600 text-white p-2 rounded-lg"
                data-oid="4fl0:60"
              >
                <FileText className="h-6 w-6" data-oid="k.82rlz" />
              </div>
              <span className="text-xl font-bold" data-oid="79xj1-6">
                PDF4EVER
              </span>
              <Badge variant="secondary" data-oid="8mf08rm">
                Free
              </Badge>
            </div>

            <nav
              className="hidden md:flex items-center gap-6"
              data-oid="fvq-9l8"
            >
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                data-oid="zdumeqm"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                data-oid="ogxp.ki"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                data-oid="-tbprmk"
              >
                About
              </a>
              <AuthDialogs
                trigger={
                  <Button variant="outline" data-oid="m_x6opk">
                    Sign In
                  </Button>
                }
                data-oid="1_p25-i"
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4" data-oid="a5pfddm">
        <div className="container mx-auto text-center" data-oid="cab:3w.">
          <div className="max-w-4xl mx-auto" data-oid="g2keyr4">
            <h1
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              data-oid="ke-44uc"
            >
              The Ultimate
              <span
                className="text-blue-600 dark:text-blue-400"
                data-oid="zc_-:cp"
              >
                {" "}
                PDF Editor
              </span>
              <br data-oid="uqsez11" />
              You'll Ever Need
            </h1>

            <p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              data-oid="4dk9sa3"
            >
              Edit, merge, split, annotate, and transform your PDFs with our
              powerful, privacy-first editor. No downloads required, works
              entirely in your browser.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              data-oid="845dlwm"
            >
              <Button
                size="lg"
                className="text-lg px-8 py-3"
                onClick={onGetStarted}
                data-oid="e6ix1qy"
              >
                <Upload className="h-5 w-5 mr-2" data-oid="aaj04eu" />
                Start Editing Now
              </Button>

              <AuthDialogs
                defaultTab="signup"
                trigger={
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-3"
                    data-oid="bn44wjk"
                  >
                    Create Free Account
                    <ArrowRight className="h-5 w-5 ml-2" data-oid=":cw_87j" />
                  </Button>
                }
                data-oid=".s-p:nw"
              />
            </div>

            <div
              className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
              data-oid="nbodg50"
            >
              <div className="flex items-center gap-2" data-oid="8yl69zl">
                <Shield className="h-4 w-4" data-oid="__brkiz" />
                Privacy First
              </div>
              <div className="flex items-center gap-2" data-oid="qwk.igw">
                <Zap className="h-4 w-4" data-oid="017ddu_" />
                Lightning Fast
              </div>
              <div className="flex items-center gap-2" data-oid="hgiddac">
                <Globe className="h-4 w-4" data-oid="7l3l409" />
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
        data-oid="kebffap"
      >
        <div className="container mx-auto" data-oid="t0abagy">
          <div className="text-center mb-16" data-oid="ee5l0jo">
            <h2
              className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
              data-oid="o:y3d_z"
            >
              Everything You Need for PDF Editing
            </h2>
            <p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              data-oid="tukqs57"
            >
              Comprehensive tools for all your PDF needs, from basic editing to
              advanced annotations
            </p>
          </div>

          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-oid="95wj2.m"
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
                data-oid="da36ftu"
              >
                <CardHeader data-oid="nynakvr">
                  <feature.icon
                    className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4"
                    data-oid="htrr2jk"
                  />
                  <CardTitle data-oid="7szgxgj">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent data-oid="8ga6zxe">
                  <p
                    className="text-gray-600 dark:text-gray-300"
                    data-oid="97w7rwy"
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
      <section className="py-16 px-4" data-oid="uox2v-8">
        <div className="container mx-auto" data-oid="jm6j:5b">
          <div
            className="grid md:grid-cols-4 gap-8 text-center"
            data-oid="0.l6.zw"
          >
            {[
              { number: "1M+", label: "Documents Processed" },
              { number: "50K+", label: "Happy Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "0", label: "Data Stored" },
            ].map((stat, index) => (
              <div key={index} data-oid="8_mewai">
                <div
                  className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"
                  data-oid="c4jw91:"
                >
                  {stat.number}
                </div>
                <div
                  className="text-gray-600 dark:text-gray-300"
                  data-oid=".ee9bsu"
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
        data-oid="j3vl:64"
      >
        <div className="container mx-auto" data-oid="i.67nbl">
          <div className="text-center mb-16" data-oid=".c7yisw">
            <h2
              className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
              data-oid="pji9-:p"
            >
              Simple, Transparent Pricing
            </h2>
            <p
              className="text-xl text-gray-600 dark:text-gray-300"
              data-oid="b6ey2m-"
            >
              Choose the plan that works best for you
            </p>
          </div>

          <div
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            data-oid="c58c3:w"
          >
            {/* Free Plan */}
            <Card className="relative" data-oid="prsg4.7">
              <CardHeader data-oid="q4-a07n">
                <CardTitle className="text-2xl" data-oid=".1r_4dr">
                  Free Forever
                </CardTitle>
                <div className="text-4xl font-bold" data-oid="8c:e7:z">
                  $0
                </div>
                <p
                  className="text-gray-600 dark:text-gray-300"
                  data-oid="h90zfmw"
                >
                  Perfect for personal use
                </p>
              </CardHeader>
              <CardContent className="space-y-4" data-oid=".-h3-g1">
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
                    data-oid="kf24k.i"
                  >
                    <Check
                      className="h-5 w-5 text-green-500"
                      data-oid="a417wz-"
                    />
                    <span data-oid="ucoxroc">{feature}</span>
                  </div>
                ))}
                <Button
                  className="w-full mt-6"
                  onClick={onGetStarted}
                  data-oid="x1xu8ye"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card
              className="relative border-blue-500 shadow-lg"
              data-oid="4uvgrmb"
            >
              <div
                className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                data-oid="cq6u1a0"
              >
                <Badge className="bg-blue-600" data-oid="grzuea1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader data-oid="i6yqx85">
                <CardTitle className="text-2xl" data-oid="rn0cnvn">
                  Pro
                </CardTitle>
                <div className="text-4xl font-bold" data-oid=":83jb0k">
                  $9
                  <span className="text-lg" data-oid="u1qx5gt">
                    /month
                  </span>
                </div>
                <p
                  className="text-gray-600 dark:text-gray-300"
                  data-oid="cw9kc6_"
                >
                  For power users and professionals
                </p>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="nilj-p:">
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
                    data-oid="y6fbdzb"
                  >
                    <Check
                      className="h-5 w-5 text-green-500"
                      data-oid="gdcug91"
                    />
                    <span data-oid="s7dywwo">{feature}</span>
                  </div>
                ))}
                <AuthDialogs
                  defaultTab="signup"
                  trigger={
                    <Button className="w-full mt-6" data-oid="-:f33zm">
                      Start Pro Trial
                    </Button>
                  }
                  data-oid="d_wdqk_"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section
        className="py-16 px-4 bg-blue-50 dark:bg-blue-900/20"
        data-oid="-y-lvm6"
      >
        <div className="container mx-auto text-center" data-oid="skqbxh8">
          <div className="max-w-3xl mx-auto" data-oid="7kxs1w7">
            <Shield
              className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-6"
              data-oid="cxobp:e"
            />
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              data-oid="ayzd8tl"
            >
              Your Privacy is Our Priority
            </h2>
            <p
              className="text-lg text-gray-600 dark:text-gray-300 mb-6"
              data-oid="thhcoxs"
            >
              Unlike other PDF editors, we process everything in your browser.
              Your documents never leave your device, ensuring complete privacy
              and security.
            </p>
            <div
              className="flex items-center justify-center gap-8 text-sm"
              data-oid="9mw42ip"
            >
              <div className="flex items-center gap-2" data-oid="1iv-uz8">
                <Lock className="h-4 w-4 text-green-500" data-oid="_3co2pt" />
                Client-side processing
              </div>
              <div className="flex items-center gap-2" data-oid="box9r0r">
                <Eye className="h-4 w-4 text-green-500" data-oid="0x-acl3" />
                No data collection
              </div>
              <div className="flex items-center gap-2" data-oid="r.t.vi7">
                <Clock className="h-4 w-4 text-green-500" data-oid="hjxa3qg" />
                Works offline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        data-oid="5dw0hct"
      >
        <div className="container mx-auto text-center" data-oid="p83zc14">
          <h2 className="text-4xl font-bold mb-4" data-oid="pzw68.o">
            Ready to Transform Your PDF Workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90" data-oid="7p9hkoj">
            Join thousands of users who trust PDF4EVER for their document needs
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-oid="q23xcib"
          >
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-3"
              onClick={onGetStarted}
              data-oid="t3z13og"
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
                  data-oid="f5fi3d."
                >
                  Create Free Account
                </Button>
              }
              data-oid="v2_n35z"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="bg-gray-900 text-white py-12 px-4"
        data-oid="z8b_v3a"
      >
        <div className="container mx-auto" data-oid="-iy:k0y">
          <div className="grid md:grid-cols-4 gap-8" data-oid="89zhvn0">
            <div data-oid="jd.mls9">
              <div className="flex items-center gap-2 mb-4" data-oid="6kzeqmj">
                <div
                  className="bg-blue-600 text-white p-2 rounded-lg"
                  data-oid="nuo9:jf"
                >
                  <FileText className="h-6 w-6" data-oid="52zq4_y" />
                </div>
                <span className="text-xl font-bold" data-oid=":d:::e5">
                  PDF4EVER
                </span>
              </div>
              <p className="text-gray-400 mb-4" data-oid="qe9otv8">
                The most powerful PDF editor that respects your privacy.
              </p>
              <div className="flex gap-4" data-oid="-yrun9l">
                <Button size="sm" variant="ghost" data-oid="og6.7l7">
                  <Github className="h-4 w-4" data-oid="f4hxu23" />
                </Button>
                <Button size="sm" variant="ghost" data-oid="-qaaluw">
                  <Twitter className="h-4 w-4" data-oid="oo0294h" />
                </Button>
                <Button size="sm" variant="ghost" data-oid="86i371b">
                  <Mail className="h-4 w-4" data-oid="1-n4jw:" />
                </Button>
              </div>
            </div>

            <div data-oid="54zn--e">
              <h4 className="font-semibold mb-4" data-oid="-3wdgfk">
                Features
              </h4>
              <div className="space-y-2 text-gray-400" data-oid="f:68qlo">
                <div data-oid="y7et0zx">PDF Editor</div>
                <div data-oid="62mch8i">Form Filling</div>
                <div data-oid=".mxwc65">Text Recognition</div>
                <div data-oid="j9.4.lm">Merge & Split</div>
                <div data-oid="lxr0o2u">Annotations</div>
              </div>
            </div>

            <div data-oid="k0ai2t8">
              <h4 className="font-semibold mb-4" data-oid="-tv-9:3">
                Resources
              </h4>
              <div className="space-y-2 text-gray-400" data-oid="ujubse2">
                <div data-oid="iuacfn9">Documentation</div>
                <div data-oid="wsn9tqp">API Reference</div>
                <div data-oid="vbdt-m4">Tutorials</div>
                <div data-oid="au9-0md">Blog</div>
                <div data-oid="4esbxs5">Support</div>
              </div>
            </div>

            <div data-oid="bo0vpn1">
              <h4 className="font-semibold mb-4" data-oid="1.3ll8i">
                Company
              </h4>
              <div className="space-y-2 text-gray-400" data-oid="-jd_z8m">
                <div data-oid="ctauhzb">About Us</div>
                <div data-oid="4ccpfix">Privacy Policy</div>
                <div data-oid="m5.1v3m">Terms of Service</div>
                <div data-oid="zp43smw">Contact</div>
                <div data-oid="812dak6">Careers</div>
              </div>
            </div>
          </div>

          <div
            className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
            data-oid="sa00uc_"
          >
            <p data-oid=".sl.nus">
              © 2024 PDF4EVER. Made with{" "}
              <Heart
                className="h-4 w-4 inline text-red-500"
                data-oid="5j0mu8s"
              />{" "}
              for document lovers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
