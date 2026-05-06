import Link from "next/link"
import PublicNavbar from "@/components/PublicNavbar"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto px-4 py-20 text-center">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              Healthcare Management System
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 text-balance mb-4">
              Quality healthcare, simplified for everyone
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty mb-8">
              Book appointments, find doctors, search medicines, and manage your medical journey
              with MediCare HMS.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/booking"
                className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Book Appointment
              </Link>
              <Link
                href="/doctors"
                className="px-6 py-3 bg-white border border-slate-300 text-slate-900 rounded-md font-medium hover:bg-slate-50"
              >
                Find Doctor
              </Link>
              <Link
                href="/medicines"
                className="px-6 py-3 bg-white border border-slate-300 text-slate-900 rounded-md font-medium hover:bg-slate-50"
              >
                Search Medicine
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              title="Book Appointment"
              description="Schedule visits with verified specialists at top hospitals."
              href="/booking"
              cta="Book now"
            />
            <FeatureCard
              title="Search Medicine"
              description="Browse approved medicines with detailed dosage and usage info."
              href="/medicines"
              cta="Browse"
            />
            <FeatureCard
              title="Find Doctor"
              description="Discover doctors by specialty and hospital location."
              href="/doctors"
              cta="Search"
            />
          </div>
        </section>

        <section className="bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">For healthcare professionals</h2>
            <p className="text-slate-300 mb-6">Access dashboards built for your workflow.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-white text-slate-900 rounded-md font-medium hover:bg-slate-100"
            >
              Staff Login
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
          MediCare HMS - Demo Prototype
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description, href, cta }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-4">{description}</p>
      <Link href={href} className="text-blue-600 font-medium hover:underline">
        {cta} &rarr;
      </Link>
    </div>
  )
}
