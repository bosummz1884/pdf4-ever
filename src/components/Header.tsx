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
      data-oid="0pg-jn9"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-oid="xzn-s8d"
      >
        <div
          className="flex justify-between items-center h-16"
          data-oid="pvoacng"
        >
          {/* Logo */}
          <div className="flex items-center" data-oid="2fief9q">
            <div className="flex-shrink-0" data-oid="pkrf:0c">
              <h1 className="text-2xl font-bold" data-oid="45az.0k">
                <span className="text-muted-foreground" data-oid="j:88v5n">
                  PDF
                </span>
                <span className="text-primary" data-oid="b0bk5hf">
                  4EVER
                </span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" data-oid="mfzl6-8">
            <div
              className="ml-10 flex items-baseline space-x-8"
              data-oid="-llxm-g"
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
                  data-oid="ne3jm-7"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:block" data-oid="r.n4u-p">
            <div
              className="ml-4 flex items-center md:ml-6 space-x-3"
              data-oid="vf203-m"
            >
              <ThemeToggle data-oid="11ulv8w" />
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="text-muted-foreground hover:text-primary hover:bg-transparent px-4 py-2 text-sm font-medium border-0"
                data-oid="cb_4owu"
              >
                Login
              </Button>
              <Button
                onClick={handleSignUp}
                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg text-sm font-medium border-0"
                data-oid="ijaexlv"
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div
            className="md:hidden flex items-center space-x-2"
            data-oid="qngzi95"
          >
            <ThemeToggle data-oid="lr0c1fg" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground hover:text-primary"
              data-oid="5o:dctb"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" data-oid="..4va2j" />
              ) : (
                <Menu className="h-6 w-6" data-oid="at4jr7z" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-border bg-background"
          data-oid="fq5okv:"
        >
          <div className="px-2 pt-2 pb-3 space-y-1" data-oid="8_rp6j1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground block px-3 py-2 text-base font-medium w-full text-left hover:text-primary"
                data-oid=":y.cj_n"
              >
                {item.name}
              </button>
            ))}
            <div
              className="pt-4 pb-3 border-t border-border"
              data-oid="ov27rle"
            >
              <div
                className="flex items-center px-3 space-x-3"
                data-oid="yfp8kkm"
              >
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="text-muted-foreground px-4 py-2 text-sm font-medium"
                  data-oid="q--pm.f"
                >
                  Login
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium"
                  data-oid="3w26psl"
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
