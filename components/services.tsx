import Image from "next/image"
import { Camera, Heart, Users, Palette, ShoppingBag, GraduationCap, ImageIcon } from "lucide-react"

const services = [
  {
    icon: Heart,
    title: "Wedding Photography",
    description: "Capturing the magic of your special day with artistic vision and attention to every emotional detail.",
    image: "/images/hero-wedding.jpg",
  },
  {
    icon: Camera,
    title: "Studio Portraits",
    description: "Professional headshots and portraits in our fully equipped studio with expert lighting.",
    image: "/images/studio-portrait.jpg",
  },
  {
    icon: Users,
    title: "Photoshoots",
    description: "Creative outdoor and indoor sessions for individuals, couples, and families.",
    image: "/images/photoshoot.jpg",
  },
  {
    icon: ImageIcon,
    title: "Photomounts",
    description: "Premium quality photo mounting and framing services to preserve your memories.",
    image: "/images/family-portrait.jpg",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Creative design services for albums, invitations, banners, and marketing materials.",
    image: "/images/editing-training.jpg",
  },
  {
    icon: ShoppingBag,
    title: "Camera Accessories",
    description: "Quality camera equipment, accessories, and gear for photographers of all levels.",
    image: "/images/camera-gear.jpg",
  },
  {
    icon: GraduationCap,
    title: "Editing & Training",
    description: "Learn professional photo editing techniques and photography skills from our experts.",
    image: "/images/editing-training.jpg",
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="text-primary font-medium tracking-widest uppercase text-sm">What We Offer</span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 tracking-tight">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Comprehensive photography solutions tailored to your needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-foreground">
                    {service.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>

              {/* Hover Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
