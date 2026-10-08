import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center animate-fade-in">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md gradient-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ApplyZen — Track every application. Land your dream job." },
      {
        name: "description",
        content:
          "ApplyZen helps job seekers organize, track, and manage every job application in one clean dashboard.",
      },
      { property: "og:title", content: "ApplyZen — Track every application. Land your dream job." },
      {
        property: "og:description",
        content:
          "ApplyZen helps job seekers organize, track, and manage every job application in one clean dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "ApplyZen — Track every application. Land your dream job.",
      },
      {
        name: "twitter:description",
        content:
          "ApplyZen helps job seekers organize, track, and manage every job application in one clean dashboard.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/00afa0db-35d3-4596-8454-c97cecb1dd5f/id-preview-3b27cd90--63a037de-fad8-4009-9b1c-ea1e93d307df.lovable.app-1777573531048.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/00afa0db-35d3-4596-8454-c97cecb1dd5f/id-preview-3b27cd90--63a037de-fad8-4009-9b1c-ea1e93d307df.lovable.app-1777573531048.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-right" />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
