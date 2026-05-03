"use client";

import Image from "next/image";
import { ShoppingCart, Star, Tag } from "lucide-react";

const products = [
  { id: 1, name: "Canon EOS R5", category: "Camera", price: 485000, originalPrice: 520000, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=500&fit=crop", rating: 4.9, inStock: true, orientation: "portrait" },
  { id: 2, name: "Sony 24-70mm", category: "Lens", price: 165000, image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=300&fit=crop", rating: 4.8, inStock: true, orientation: "landscape" },
  { id: 3, name: "Godox AD600", category: "Lighting", price: 78000, image: "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?w=400&h=300&fit=crop", rating: 4.7, inStock: true, orientation: "landscape" },
  { id: 4, name: "DJI RS 3 Pro", category: "Stabilizer", price: 125000, originalPrice: 145000, image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400&h=500&fit=crop", rating: 4.9, inStock: false, orientation: "portrait" },
  { id: 5, name: "SanDisk 128GB", category: "Storage", price: 8500, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop", rating: 4.6, inStock: true, orientation: "landscape" },
  { id: 6, name: "Manfrotto Tripod", category: "Support", price: 45000, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=500&fit=crop", rating: 4.8, inStock: true, orientation: "portrait" },
  { id: 7, name: "Peak Design Bag", category: "Bags", price: 32000, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", rating: 4.7, inStock: true, orientation: "landscape" },
  { id: 8, name: "Nikon Z6 II", category: "Camera", price: 298000, image: "https://images.unsplash.com/photo-1606986628270-2d695387fedf?w=400&h=500&fit=crop", rating: 4.8, inStock: true, orientation: "portrait" },
];

export function Products() {
  return (
    <section id="products" className="py-6 sm:py-12 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-3 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <div className="h-px w-4 sm:w-8 bg-amber-400" />
            <span className="text-[8px] sm:text-xs uppercase tracking-widest text-amber-400">Shop</span>
          </div>
          <h2 className="text-sm sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
            Camera & Accessories
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-1 sm:gap-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="mb-1 sm:mb-2 break-inside-avoid group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-md sm:rounded-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={product.orientation === 'portrait' ? 400 : 200}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Sale Badge */}
                {product.originalPrice && (
                  <div className="absolute top-1 left-1">
                    <span className="px-1 py-0.5 text-[6px] sm:text-[8px] font-medium bg-amber-400 text-background rounded">
                      Sale
                    </span>
                  </div>
                )}

                {/* Stock Badge */}
                {!product.inStock && (
                  <div className="absolute top-1 right-1">
                    <span className="px-1 py-0.5 text-[6px] sm:text-[8px] font-medium bg-red-500/80 text-white rounded">
                      Sold
                    </span>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-1 sm:p-2">
                    <p className="text-[8px] sm:text-[10px] font-medium text-white">{product.name}</p>
                    <p className="text-[6px] sm:text-[8px] text-white/60">{product.category}</p>
                    
                    <div className="flex items-center justify-between mt-0.5 sm:mt-1">
                      <div className="flex items-center gap-0.5">
                        <span className="text-[8px] sm:text-[10px] font-semibold text-amber-400">
                          KSH {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[6px] sm:text-[8px] text-white/40 line-through">
                            {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-amber-400 fill-amber-400" />
                        <span className="text-[6px] sm:text-[8px] text-white/70">{product.rating}</span>
                      </div>
                    </div>

                    {/* Add to Cart */}
                    {product.inStock && (
                      <button className="mt-1 w-full flex items-center justify-center gap-0.5 py-0.5 text-[6px] sm:text-[8px] border border-amber-400/50 text-amber-400 rounded hover:bg-amber-400 hover:text-background transition-all duration-300">
                        <ShoppingCart className="h-1.5 w-1.5 sm:h-2 sm:w-2" strokeWidth={1.5} />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-3 sm:mt-6 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-1 text-[8px] sm:text-xs text-muted-foreground hover:text-amber-400 transition-colors"
          >
            <Tag className="h-2 w-2 sm:h-3 sm:w-3" strokeWidth={1.5} />
            <span>View All Products</span>
          </a>
        </div>
      </div>
    </section>
  );
}
