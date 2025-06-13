import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    console.log("Login clicked");
  };

  const handleSignUp = () => {
    console.log("Sign up clicked");
  };

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`bg-background dark:bg-background border-b border-border sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? "shadow-lg" : "shadow-sm"}`}
      data-oid="q0.p_:7"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-oid="6uhj6yq"
      >
        <div
          className="flex justify-between items-center h-16"
          data-oid="ldwjsws"
        >
          {/* Logo */}
          <div className="flex items-center" data-oid="7g-gadz">
            <div className="flex-shrink-0" data-oid="wbc.0wq">
              <h1 className="text-2xl font-bold" data-oid="bbv1tol">
                <span className="text-muted-foreground" data-oid="_020wqo">
                  PDF
                </span>
                <span className="text-primary" data-oid="2kln.9x">
                  4EVER
                </span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" data-oid="z::o8ed">
            <div
              className="ml-10 flex items-baseline space-x-8"
              data-oid="r470llx"
            >
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    index === 0
                      ? "text-foreground hover:text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  data-oid="pp4ch:."
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:block" data-oid=":9bfin7">
            <div
              className="ml-4 flex items-center md:ml-6 space-x-3"
              data-oid="jifypov"
            >
              <ThemeToggle data-oid="exo9fka" />
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="text-muted-foreground hover:text-primary hover:bg-transparent px-4 py-2 text-sm font-medium border-0"
                data-oid="ntym.tj"
              >
                Login
              </Button>
              <Button
                onClick={handleSignUp}
                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg text-sm font-medium border-0"
                data-oid="-0obvbg"
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div
            className="md:hidden flex items-center space-x-2"
            data-oid="arpeg-_"
          >
            <ThemeToggle data-oid="e7ch__p" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground hover:text-primary"
              data-oid="pi64ynh"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" data-oid="f4gc502" />
              ) : (
                <Menu className="h-6 w-6" data-oid=".34cmid" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-border bg-background"
          data-oid="4xoj74-"
        >
          <div className="px-2 pt-2 pb-3 space-y-1" data-oid="4gxsma-">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground block px-3 py-2 text-base font-medium w-full text-left hover:text-primary"
                data-oid="sekfkcc"
              >
                {item.name}
              </button>
            ))}
            <div
              className="pt-4 pb-3 border-t border-border"
              data-oid="gsjaf36"
            >
              <div
                className="flex items-center px-3 space-x-3"
                data-oid="e.ujfnr"
              >
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="text-muted-foreground px-4 py-2 text-sm font-medium"
                  data-oid="ij2w0ey"
                >
                  Login
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium"
                  data-oid="vqa.rgv"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
