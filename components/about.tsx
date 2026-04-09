import Image from "next/image"
import { Award, Clock, Heart, Sparkles } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "Professional Quality",
    description: "Industry-standard equipment and expertise",
  },
  {
    icon: Clock,
    title: "Quick Turnaround",
    description: "Fast delivery without compromising quality",
  },
  {
    icon: Heart,
    title: "Passionate Team",
    description: "Dedicated photographers who love their craft",
  },
  {
    icon: Sparkles,
    title: "Creative Vision",
    description: "Unique perspectives for every project",
  },
]

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="/images/studio-portrait.jpg"
                alt="BMA Photography Studio"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-card border border-border rounded-lg p-6 shadow-xl max-w-xs">
              <div className="font-[family-name:var(--font-heading)] text-4xl font-bold text-primary mb-2">
                10+
              </div>
              <p className="text-muted-foreground">
                Years of excellence in photography
              </p>
            </div>
            {/* Decorative Element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-primary rounded-lg -z-10" />
          </div>

          {/* Content Side */}
          <div>
            <span className="text-primary font-medium tracking-widest uppercase text-sm">
              About Us
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 tracking-tight">
              BMA Photography
              <br />
              <span className="text-primary">Studio</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Located in the heart of Nyeri, Kenya, BMA Photography Studio has been capturing life&apos;s most precious moments for over a decade. Our passion for photography drives us to deliver exceptional quality in every shot.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              From intimate weddings to professional headshots, we bring creativity, technical expertise, and a personal touch to every project. Our fully equipped studio and experienced team ensure that your vision becomes reality.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
