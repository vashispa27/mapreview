import { blogs } from "@/lib/blog-data"
import Link from "next/link"
import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Gym Software Comparisons & Insights | MapToSite Blog",
  description: "Compare the best gym management software in India. Honest comparisons of GymBook, EasyGymSoftware, GymOwl, and FitGymSoftware vs MapToSite.",
  alternates: {
    canonical: "https://maptosite.app/blog",
  },
  openGraph: {
    title: "Gym Software Comparisons & Insights | MapToSite Blog",
    description: "Compare the best gym management software in India. Honest comparisons of GymBook, EasyGymSoftware, GymOwl, and FitGymSoftware vs MapToSite.",
    url: "https://maptosite.app/blog",
    type: "website",
    siteName: "MapToSite",
  },
}

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
              The <span className="text-primary">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, comparisons, and growth strategies for modern gym owners and businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogs.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full border-2 transition-all hover:border-primary hover:shadow-xl overflow-hidden flex flex-col">
                  <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
                    {/* Placeholder for real images */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center p-8 text-center font-bold text-muted-foreground uppercase italic tracking-widest opacity-50 group-hover:scale-105 transition-transform duration-500">
                      {post.title}
                    </div>
                    <Badge className="absolute top-4 left-4 font-black uppercase tracking-widest">
                      {post.category}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={post.isoDate}>{post.date}</time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-0 font-black uppercase tracking-widest text-sm text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                    Read Comparison <ArrowRight className="w-4 h-4" />
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
