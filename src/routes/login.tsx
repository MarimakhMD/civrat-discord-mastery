import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/civrat/Logo";
import { Button } from "@/components/ui/button";
import { Shield, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — CIVRAT" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleLogin() {
    setLoading(true);
    setTimeout(() => navigate({ to: "/servers" }), 1100);
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />

      <div className="animate-fade-up w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>

        <div className="glass-strong rounded-2xl p-8 shadow-elegant">
          <div className="flex flex-col items-center text-center">
            <div className="animate-glow grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
              <DiscordMark className="h-8 w-8" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold">Connexion sécurisée</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Connectez-vous avec votre compte Discord pour accéder au dashboard CIVRAT.
            </p>

            <Button
              onClick={handleLogin}
              disabled={loading}
              size="lg"
              className="mt-7 h-12 w-full gap-2 bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 shadow-neon"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Connexion en cours…
                </>
              ) : (
                <>
                  <DiscordMark className="h-5 w-5" /> Continuer avec Discord
                </>
              )}
            </Button>

            <ul className="mt-6 grid w-full gap-2 text-left text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> OAuth2 officiel Discord</li>
              <li className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-primary" /> Aucune donnée stockée sans consentement</li>
              <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-primary" /> Sessions chiffrées et révocables</li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          En continuant, vous acceptez nos <a className="underline hover:text-foreground" href="#">CGU</a> et notre <a className="underline hover:text-foreground" href="#">politique de confidentialité</a>.
        </p>
      </div>
    </div>
  );
}

function DiscordMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3c-.196.357-.42.83-.577 1.207a18.27 18.27 0 0 0-5.962 0A12.86 12.86 0 0 0 9.43 3 19.74 19.74 0 0 0 5.67 4.371C2.39 9.255 1.494 14.02 1.942 18.717a19.94 19.94 0 0 0 6.013 3.058c.486-.66.92-1.36 1.293-2.094-.71-.27-1.39-.6-2.03-.99.17-.126.337-.258.498-.394 3.927 1.83 8.18 1.83 12.062 0 .163.136.33.268.5.394-.64.39-1.323.72-2.034.99.374.734.808 1.435 1.293 2.094a19.9 19.9 0 0 0 6.017-3.058c.5-5.444-.838-10.165-3.237-14.348ZM9.34 15.804c-1.183 0-2.157-1.085-2.157-2.42 0-1.337.953-2.422 2.157-2.422 1.21 0 2.18 1.094 2.157 2.422 0 1.335-.953 2.42-2.157 2.42Zm5.32 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.337.953-2.422 2.157-2.422 1.21 0 2.18 1.094 2.157 2.422 0 1.335-.946 2.42-2.157 2.42Z" />
    </svg>
  );
}
