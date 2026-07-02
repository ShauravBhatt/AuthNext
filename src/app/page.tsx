import Link from "next/link";

const features = [
  {
    icon: "🔒",
    title: "Secure Authentication",
    description:
      "JWT authentication with HTTP-only cookies and encrypted passwords.",
  },
  {
    icon: "📧",
    title: "Email Verification",
    description:
      "Verify every account securely using email verification tokens.",
  },
  {
    icon: "🔄",
    title: "Password Recovery",
    description: "Secure password reset flow with token verification.",
  },
  {
    icon: "⚡",
    title: "Production Ready",
    description: "Built using Next.js App Router and scalable architecture.",
  },
];

const technologies = [
  "Next.js",
  "TypeScript",
  "MongoDB",
  "Mongoose",
  "JWT",
  "bcrypt",
  "Nodemailer",
  "Axios",
  "Tailwind CSS",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black tracking-[0.3em]">
            AUTHNEXT
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/20 px-5 py-2 hover:bg-white hover:text-black transition"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2 font-semibold text-black hover:scale-105 transition"
            >
              Sign Up
            </Link>

            <Link
              href="https://github.com/ShauravBhatt/AuthNext.git"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-2 hover:bg-white hover:text-black transition"
            >
              GitHub
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 lg:grid-cols-2">
          <div>
            <span className="rounded-full border border-white/15 px-4 py-2 text-xs tracking-[0.3em] text-gray-400">
              NEXT.JS • TYPESCRIPT • MONGODB
            </span>

            <h1 className="mt-8 text-6xl font-black leading-tight">
              Production Ready
              <br />
              Authentication
              <br />
              System
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
              Complete authentication workflow featuring Login, Signup, Email
              Verification, JWT Authentication, Secure Cookies, Password Reset
              and Protected Routes.
            </p>

            <div className="mt-10 flex gap-4">
              <Link
                href="/login"
                className="rounded-full bg-white px-8 py-4 font-semibold text-black hover:scale-105 transition"
              >
                Get Started →
              </Link>

              <Link
                href="https://github.com/ShauravBhatt/AuthNext.git"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-8 py-4 hover:bg-white hover:text-black transition"
              >
                View Source
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl overflow-hidden">
            <div className="flex gap-2 border-b border-white/10 px-6 py-4">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>

            <pre className="overflow-x-auto p-8 text-sm leading-8 text-gray-300">{`POST /api/login

✓ Validate User
✓ Compare Password
✓ Generate JWT
✓ HTTP Only Cookie
✓ Redirect -> /profile

Status: 200 OK`}</pre>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-2 hover:border-white/30"
          >
            <div className="text-4xl">{feature.icon}</div>
            <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
            <p className="mt-3 text-gray-400">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 text-center">
        <h2 className="text-4xl font-bold">Built With Modern Technologies</h2>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {technologies.map((tech) => (
            <div
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 hover:bg-white hover:text-black transition"
            >
              {tech}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-[36px] border border-white/10 bg-white/5 p-12 text-center">
          <h2 className="text-4xl font-bold">Explore the Source Code</h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-400">
            Browse the complete implementation, understand the architecture and
            contribute to the project on GitHub.
          </p>

          <Link
            href="https://github.com/ShauravBhatt/AuthNext.git"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 font-semibold text-black hover:scale-105 transition"
          >
            ⭐ View Source on GitHub
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-gray-500">
        Built with ❤️ by Shaurav | using Next.js · TypeScript · MongoDB
      </footer>
    </main>
  );
}
