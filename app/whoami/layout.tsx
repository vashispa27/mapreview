import "./whoami.css"

export const metadata = {
  title: "Abhinav Vashisht — Founder, MapToSite",
  description: "Building the digital infrastructure layer for India's small businesses. Solo founder applying to EF.",
}

export default function WhoAmILayout({ children }: { children: React.ReactNode }) {
  return <div className="whoami-root">{children}</div>
}
