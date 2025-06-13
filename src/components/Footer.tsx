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
      data-oid="4orftvg"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        data-oid="_d_-_05"
      >
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          data-oid=".r77ywx"
        >
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2" data-oid="yv93ob7">
            <h3 className="text-2xl font-bold mb-4" data-oid="1q4itls">
              <span className="text-muted-foreground" data-oid="xvtk7bp">
                PDF
              </span>
              <span className="text-primary" data-oid="zyjhwbo">
                4EVER
              </span>
            </h3>
            <p
              className="text-muted-foreground mb-6 max-w-md"
              data-oid="sqxoi_l"
            >
              The most powerful online PDF editor. Edit, convert, and manage
              your PDFs with ease.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4" data-oid="2061ein">
              {socialLinks.map((social) => (
                <Button
                  key={social.platform}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSocial(social.platform)}
                  className="w-10 h-10 bg-muted dark:bg-muted rounded-lg hover:bg-primary transition-colors duration-200 text-muted-foreground hover:text-white"
                  data-oid="he31i-_"
                >
                  <social.icon className="h-5 w-5" data-oid="dizmoxc" />
                  <span className="sr-only" data-oid="a3rfn_u">
                    {social.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div data-oid=".6mq._p">
            <h4
              className="text-lg font-semibold text-foreground mb-4"
              data-oid="pd.l4k0"
            >
              Product
            </h4>
            <ul className="space-y-3" data-oid="dapyzc9">
              <li data-oid="ng151:q">
                <button
                  onClick={() => scrollToSection("#features")}
                  className="hover:text-primary transition-colors duration-200 text-left text-muted-foreground"
                  data-oid="a_60ugb"
                >
                  Features
                </button>
              </li>
              <li data-oid="hd63vyz">
                <button
                  onClick={() => scrollToSection("#pricing")}
                  className="hover:text-primary transition-colors duration-200 text-left text-muted-foreground"
                  data-oid="ad703pm"
                >
                  Pricing
                </button>
              </li>
              <li data-oid="7y6jstj">
                <a
                  href="#"
                  className="hover:text-primary transition-colors duration-200 text-muted-foreground"
                  data-oid="l:33-uj"
                >
                  API
                </a>
              </li>
              <li data-oid="v3amhm8">
                <a
                  href="#"
                  className="hover:text-primary transition-colors duration-200 text-muted-foreground"
                  data-oid="u3fa9zy"
                >
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div data-oid="qlfbr.d">
            <h4
              className="text-lg font-semibold text-foreground mb-4"
              data-oid="l73c9u3"
            >
              Support
            </h4>
            <ul className="space-y-3" data-oid="su8q_fm">
              <li data-oid="2095nb9">
                <button
                  onClick={handleContact}
                  className="hover:text-primary transition-colors duration-200 text-left text-muted-foreground"
                  data-oid="m6.1jgq"
                >
                  Contact
                </button>
              </li>
              <li data-oid="wlntoua">
                <button
                  onClick={handlePrivacy}
                  className="hover:text-primary transition-colors duration-200 text-left text-muted-foreground"
                  data-oid="1jikoe0"
                >
                  Privacy Policy
                </button>
              </li>
              <li data-oid="v4l57a4">
                <button
                  onClick={handleTerms}
                  className="hover:text-primary transition-colors duration-200 text-left text-muted-foreground"
                  data-oid="qh34ya:"
                >
                  Terms of Service
                </button>
              </li>
              <li data-oid="n7g:7l:">
                <a
                  href="#"
                  className="hover:text-primary transition-colors duration-200 text-muted-foreground"
                  data-oid="4en9xyq"
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
          data-oid="etiijsl"
        >
          <p className="text-muted-foreground text-sm" data-oid="3r378ef">
            © 2024{" "}
            <span className="text-muted-foreground" data-oid="lb-9ooo">
              PDF
            </span>
            <span className="text-primary" data-oid="403bitr">
              4EVER
            </span>
            . All rights reserved.
          </p>
          <p
            className="text-muted-foreground text-sm mt-2 sm:mt-0 max-w-md text-right"
            data-oid="8y1f_hc"
          >
            Thank you for choosing{" "}
            <span className="text-muted-foreground" data-oid="ww_4j1h">
              PDF
            </span>
            <span className="text-primary" data-oid="owzrdg:">
              4EVER
            </span>
            , we appreciate you utilizing our service. If you have any
            suggestions, or ideas on how we could make the experience better for
            you please email Admin@
            <span className="text-muted-foreground" data-oid="s-ezkuo">
              PDF
            </span>
            <span className="text-primary" data-oid="db2t9gq">
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
