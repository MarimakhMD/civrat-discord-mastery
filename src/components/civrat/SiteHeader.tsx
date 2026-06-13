import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 bg-background/70" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Fonctionnalités</a>
          <a href="#modules" className="transition-colors hover:text-foreground">Modules</a>
          <a href="#stats" className="transition-colors hover:text-foreground">Statistiques</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Connexion</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon">
            <Link to="/login">Connexion Discord</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
