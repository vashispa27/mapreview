import { blogs } from "@/lib/blog-data"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calendar, Clock, User, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Script from "next/script"

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://maptosite.app"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogs.find((b) => b.slug === slug);

  if (!post || post.content.includes("Coming soon")) return { title: "Post Not Found" };

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | MapToSite`,
    description: post.metaDescription,
    keywords: post.keywords.join(", "),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      url,
      publishedTime: post.isoDate,
      authors: [post.author],
      siteName: "MapToSite",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogs.find((b) => b.slug === slug);

  if (!post || post.content.includes("Coming soon")) {
    notFound();
  }

  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "MapToSite",
      url: SITE_URL,
    },
    datePublished: post.isoDate,
    dateModified: post.isoDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="min-h-screen bg-background">
      <Script
        id={`article-schema-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-[1.1] mb-8">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest border-y border-border py-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <time dateTime={post.isoDate}>{post.date}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {post.readTime}
              </div>
            </div>
          </header>

          <div
            className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-bold
            prose-li:text-muted-foreground prose-li:leading-relaxed
            prose-ul:my-4 prose-ol:my-4
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1
            prose-blockquote:text-muted-foreground prose-blockquote:not-italic
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
            prose-table:text-sm
            prose-thead:bg-muted/60
            prose-th:font-bold prose-th:text-foreground prose-th:px-4 prose-th:py-3
            prose-td:px-4 prose-td:py-3 prose-td:align-middle
            [&_table]:w-full [&_table]:border-collapse [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-border
            [&_thead]:bg-muted/50 [&_th]:border [&_th]:border-border [&_td]:border [&_td]:border-border
            [&_tr:nth-child(even)]:bg-muted/20"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 p-8 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                Ready to grow your gym?
              </h3>
              <p className="text-primary-foreground/90 text-lg mb-8 max-w-md font-medium">
                Get your AI-generated website and full management console in 60 seconds. Start for free.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest shadow-lg">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-widest">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
