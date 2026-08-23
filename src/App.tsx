import { useEffect, useState } from "react";
import type { Member } from "./members";
import "./index.css";

type DiscordStatus = "online" | "idle" | "dnd" | "offline";

interface LanyardUser {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
  discriminator?: string;
}

interface Presence {
  discord_status: DiscordStatus;
  discord_user: LanyardUser;
}

interface RingData {
  current: Member | null;
  prev: Member;
  next: Member;
  random: Member;
  members: Member[];
}

const pagecount = 5;

const STATUS_COLORS: Record<DiscordStatus, string> = {
  online: "#4ade80",
  idle: "#facc15",
  dnd: "#f87171",
  offline: "#9ca3af",
};

const STATUS_LABELS: Record<DiscordStatus, string> = {
  online: "online",
  idle: "idle",
  dnd: "do not disturb",
  offline: "offline",
};

export function App() {
  const [data, setData] = useState<RingData | null>(null);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(0);
  const [dark, setDark] = useState(false);
  const [presences, setPresences] = useState<Record<string, Presence | null>>(
    {},
  );
  const [avatarFails, setAvatarFails] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/ring")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("lc-theme");
    const pref =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(pref);
    document.documentElement.classList.toggle("dark", pref);
  }, []);

  useEffect(() => {
    async function loadPresence() {
      const ids = (data?.members ?? [])
        .map((m) => m.discordId)
        .filter(Boolean) as string[];
      if (ids.length === 0) return;
      try {
        const r = await fetch("/api/members/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });
        if (!r.ok) return;
        const d = (await r.json()) as {
          presences: Record<string, Presence | null>;
        };
        setPresences(d.presences);
      } catch {
        // ignore
      }
    }

    loadPresence();
    const poll = setInterval(loadPresence, 60_000);
    return () => clearInterval(poll);
  }, [data?.members]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("lc-theme", next ? "dark" : "light");
  };

  function getPresence(m: Member): Presence | null {
    if (!m.discordId) return null;
    return presences[m.discordId] ?? null;
  }

  function displayName(m: Member): string {
    const p = getPresence(m);
    return p?.discord_user?.global_name || p?.discord_user?.username || m.name;
  }

  function getHandle(m: Member): string | null {
    const user = getPresence(m)?.discord_user;
    if (!user) return null;
    if (user.discriminator && user.discriminator !== "0") {
      return `${user.username}#${user.discriminator}`;
    }
    return `@${user.username}`;
  }

  function buildAvatarUrl(user: LanyardUser, animated: boolean): string | null {
    if (!user.avatar) return null;
    const ext = animated ? "webp" : "png";
    const params = animated ? "size=96&animated=true" : "size=96";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?${params}`;
  }

  function getAvatarUrl(m: Member): string | null {
    const user = getPresence(m)?.discord_user;
    const primary = user ? buildAvatarUrl(user, user.avatar?.startsWith("a_") ?? false) : null;
    if (!primary) return null;
    if (!avatarFails.has(primary)) return primary;
    const fallback =
      primary.includes("animated=true") && user
        ? buildAvatarUrl(user, false)
        : null;
    if (fallback && !avatarFails.has(fallback)) return fallback;
    return null;
  }

  function getStatus(m: Member): DiscordStatus {
    if (!m.discordId) return "offline";
    return presences[m.discordId]?.discord_status ?? "offline";
  }

  const members = data?.members ?? [];
  const totalPages = Math.max(1, Math.ceil(members.length / pagecount));
  const safePage = Math.min(page, totalPages - 1);
  const pageMembers = members.slice(
    safePage * pagecount,
    (safePage + 1) * pagecount,
  );

  const embedCode = `<script src="${window.location.origin}/api/embed.js"></script>`;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-6 md:px-8 py-12 md:py-16">
        <header className="mb-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="/lanyard.png"
                  alt="lanyard.cafe logo"
                  className="w-10 h-10"
                />
                <h1 className="font-serif text-4xl md:text-5xl text-text leading-tight">
                  lanyard.cafe
                </h1>
              </div>
              <p className="font-sans text-text-light text-base mt-2 max-w-lg">
                The cutest lanyard webring and docs!
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="text-text-light hover:text-text transition-colors mt-3 text-lg"
              aria-label="theme"
            >
              {dark ? "☀" : "☾"}
            </button>
          </div>
        </header>

        {data && (
          <section className="mb-12 flex flex-col items-center text-center">
            <a
              href="/docs"
              className="inline-block text-base font-semibold text-text hover:text-pink-dark transition-colors mb-6"
            >
              docs →
            </a>
            <h2 className="font-serif text-2xl text-text mb-4">navigate</h2>
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-8">
                <a
                  href={data.prev.url}
                  className="text-sm font-semibold text-text-light hover:text-pink-dark transition-colors"
                >
                  ← prev
                </a>
                <a
                  href={data.random.url}
                  className="text-sm font-semibold text-text-light hover:text-pink-dark transition-colors"
                >
                  random
                </a>
                <a
                  href={data.next.url}
                  className="text-sm font-semibold text-text-light hover:text-pink-dark transition-colors"
                >
                  next →
                </a>
              </div>
              <p className="text-sm text-text-light">
                you are at{" "}
                <span className="font-semibold text-text">lanyard.cafe</span>
              </p>
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-2xl text-text">members</h2>
            {totalPages > 1 && (
              <div className="flex items-center gap-3 text-sm text-text-light">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                  className="hover:text-pink-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ◀
                </button>
                <span className="tabular-nums">
                  {safePage + 1}/{totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={safePage === totalPages - 1}
                  className="hover:text-pink-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ▶
                </button>
              </div>
            )}
          </div>
          <div className="divide-y divide-cream-dark">
            {pageMembers.map((site) => {
              const avatar = getAvatarUrl(site);
              const state = getStatus(site);
              const handle = getHandle(site);
              return (
                <a
                  key={site.name}
                  href={site.url}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative shrink-0">
                      {avatar ? (
                        <img
                          className="w-10 h-10 rounded-lg object-cover"
                          src={avatar}
                          alt=""
                          onError={() => {
                            setAvatarFails((prev) => {
                              if (prev.has(avatar)) return prev;
                              const next = new Set(prev);
                              next.add(avatar);
                              return next;
                            });
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-cream-dark flex items-center justify-center font-serif text-base text-text-light">
                          {displayName(site).slice(0, 1).toLowerCase()}
                        </div>
                      )}
                      {site.discordId && (
                        <span
                          className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full border-2 border-cream"
                          style={{ background: STATUS_COLORS[state] }}
                        />
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="font-serif text-base text-text group-hover:text-pink-dark transition-colors truncate">
                        {displayName(site)}
                      </span>
                      <span className="text-xs text-text-light truncate">
                        {handle ??
                          site.url
                            .replace(/^https?:\/\//, "")
                            .replace(/\/$/, "")}
                      </span>
                    </div>

                    {site.discordId && (
                      <span className="ml-2 shrink-0 text-xs text-text-light hidden sm:block">
                        {STATUS_LABELS[state]}
                      </span>
                    )}
                  </div>

                  {site.buttonUrl && (
                    <img
                      src={site.buttonUrl}
                      alt=""
                      className="w-[88px] h-[31px] shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ imageRendering: "pixelated" }}
                    />
                  )}
                </a>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl text-text mb-4">join</h2>
          <p className="text-sm text-text-light mb-4 max-w-md">
            want to add your site to the ring? please read{" "}
            <a href="/docs/joining" className="text-pink-dark hover:underline">
              our docs
            </a>
          </p>
          <p className="text-sm font-semibold text-text mb-2">
            add to your site:
          </p>
          <div className="flex gap-2 items-start">
            <code className="flex-1 bg-cream-dark text-text text-xs p-2.5 rounded-lg break-all font-mono">
              {embedCode}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="shrink-0 px-3 py-2 rounded-lg bg-cream-dark text-text-light text-xs hover:text-pink-dark transition-colors"
            >
              {copied ? "copied!" : "copy"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
