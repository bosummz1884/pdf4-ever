import { Button } from "./ui/button";
import { Twitter, Facebook, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const handleSocial = (platform: string) => {
    console.log(`Social link clicked: ${platform}`);
  };

  const handleContact = () => {
    console.log("Contact clicked");
  };

  const handlePrivacy = () => {
    console.log("Privacy Policy clicked");
  };

  const handleTerms = () => {
    console.log("Terms of Service clicked");
  };

  const socialLinks = [
    { icon: Twitter, platform: "twitter", label: "Twitter" },
    { icon: Facebook, platform: "facebook", label: "Facebook" },
    { icon: Linkedin, platform: "linkedin", label: "LinkedIn" },
    { icon: Github, platform: "github", label: "GitHub" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className="bg-card dark:bg-card border-t border-border"
      data-oid="6.m.4hx"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        data-oid="hmozoa1"
      >
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          data-oid="8j-u_ix"
        >
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2" data-oid="qqp3iu4">
            <h3 className="text-2xl font-bold mb-4" data-oid="kpnve3k">
              <span className="text-muted-foreground" data-oid="0cjs.qo">
                PDF
              </span>
              <span className="text-primary" data-oid="e7vy_5a">
                4EVER
              </span>
            </h3>
            <p
              className="text-muted-foreground mb-6 max-w-md"
              data-oid="d63ek70"
            >
              The most powerful online PDF editor. Edit, convert, and manage
              your PDFs with ease.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4" data-oid="3h_qg2d">
              {socialLinks.map((social) => (
                <Button
                  key={social.platform}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSocial(social.platform)}
                  className="w-10 h-10 bg-muted dark:bg-muted rounded-lg hover:bg-primary transition-colors duration-200 text-muted-foreground hover:text-white"
                  data-oid="sgh8vto"
                >
                  <social.icon className="h-5 w-5" data-oid="byhroyv" />
                  <span className="sr-only" data-oid="5fvo6h5">
                    {social.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div data-oid="r8o7fyv">
            <h4
              className="text-lg font-semibold text-foreground mb-4"
              data-oid="nhq9:7d"
            >
              Product
            </h4>
            <ul className="space-y-3" data-oid="arbdfc3">
              <li data-oid="krl1_2k">
                <button
                  onClick={() => scrollToSection("#features")}
                  className="hover:text-primary transition-colors duration-200 text-left text-muted-foreground"
                  data-oid="i1szqsw"
                >
                  Features
                </button>
              </li>
              <li data-oid="7l4x:kg">
                <button
                  onClick={() => scrollToSection("#pricing")}
                  className="hover:text-primary transition-colors duration-200 text-left text-muted-foreground"
                  data-oid="g2gj19s"
                >
                  Pricing
                </button>
              </li>
              <li data-oid="1ogh60c">
                <a
                  href="#"
                  className="hover:text-primary transition-colors duration-200 text-muted-foreground"
                  data-oid="mjs-lqt"
                >
                  API
                </a>
              </li>
              <li data-oid="te23pvh">
                <a
                  href="#"
                  className="hover:text-primary transition-colors duration-200 text-muted-foreground"
                  data-oid="zvop386"
                >
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div data-oid="nv.da:b">
            <h4
              className="text-lg font-semibold text-foreground mb-4"
              data-oid="vo8ebht"
            >
              Support
            </h4>
            <ul className="space-y-3" data-oid="k3frqhb">
              <li data-oid="azffxly">
                <button
                  onClick={handleContact}
                  className="hover:text-primary transition-colors duration-200 text-left text-muted-foreground"
                  data-oid="b52kccy"
                >
                  Contact
                </button>
              </li>
              <li data-oid="t9fk.mu">
                <button
                  onClick={handlePrivacy}
                  className="hover:text-primary transition-colors duration-200 text-left text-muted-foreground"
                  data-oid="5mcyia6"
                >
                  Privacy Policy
                </button>
              </li>
              <li data-oid="f:._jzl">
                <button
                  onClick={handleTerms}
                  className="hover:text-primary transition-colors duration-200 text-left text-muted-foreground"
                  data-oid=".74s1cf"
                >
                  Terms of Service
                </button>
              </li>
              <li data-oid="h_ddl40">
                <a
                  href="#"
                  className="hover:text-primary transition-colors duration-200 text-muted-foreground"
                  data-oid="i-9abbo"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center"
          data-oid="0yl5e4n"
        >
          <p className="text-muted-foreground text-sm" data-oid="sy63jo1">
            © 2024{" "}
            <span className="text-muted-foreground" data-oid="i5h5e32">
              PDF
            </span>
            <span className="text-primary" data-oid="wgibioj">
              4EVER
            </span>
            . All rights reserved.
          </p>
          <p
            className="text-muted-foreground text-sm mt-2 sm:mt-0 max-w-md text-right"
            data-oid="e-ywbvr"
          >
            Thank you for choosing{" "}
            <span className="text-muted-foreground" data-oid="nmqhqgi">
              PDF
            </span>
            <span className="text-primary" data-oid="18xvsjt">
              4EVER
            </span>
            , we appreciate you utilizing our service. If you have any
            suggestions, or ideas on how we could make the experience better for
            you please email Admin@
            <span className="text-muted-foreground" data-oid="gk5t2xl">
              PDF
            </span>
            <span className="text-primary" data-oid="jojg8g7">
              4EVER
            </span>
            .org with your comments and suggestions. Always remember to stay
            positive!
          </p>
        </div>
      </div>
    </footer>
  );
}
