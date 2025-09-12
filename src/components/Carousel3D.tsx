import { useCallback, useEffect, useState } from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselItem {
  id: string | number
  image: string
  title: string
}

interface Carousel3DProps {
  items: CarouselItem[]
  selectedItemId?: string | number
  onItemSelect?: (itemId: string | number) => void
  className?: string
}

export const Carousel3D = ({ items, selectedItemId, onItemSelect, className = "" }: Carousel3DProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    skipSnaps: false,
    dragFree: false,
  })
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    
    // Trigger the item selection callback
    const selectedItem = items[emblaApi.selectedScrollSnap()]
    if (selectedItem && onItemSelect) {
      onItemSelect(selectedItem.id)
    }
  }, [items, onItemSelect])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  // Sync external selection with carousel
  useEffect(() => {
    if (!emblaApi || selectedItemId === undefined) return
    
    const targetIndex = items.findIndex(item => item.id === selectedItemId)
    if (targetIndex !== -1 && targetIndex !== selectedIndex) {
      emblaApi.scrollTo(targetIndex)
    }
  }, [selectedItemId, items, emblaApi, selectedIndex])

  const getItemTransform = (index: number) => {
    const distance = Math.abs(index - selectedIndex)
    const direction = index - selectedIndex
    
    if (distance === 0) {
      // Center item - largest and most forward
      return {
        transform: 'translateX(0) rotateY(0deg) scale(1)',
        zIndex: 50,
        opacity: 1,
      }
    } else if (distance === 1) {
      // Adjacent items - smaller and angled
      const rotateY = direction > 0 ? '-25deg' : '25deg'
      const translateX = direction > 0 ? '20%' : '-20%'
      return {
        transform: `translateX(${translateX}) rotateY(${rotateY}) scale(0.85)`,
        zIndex: 40,
        opacity: 0.8,
      }
    } else if (distance === 2) {
      // Second level - even smaller and more angled
      const rotateY = direction > 0 ? '-45deg' : '45deg'
      const translateX = direction > 0 ? '35%' : '-35%'
      return {
        transform: `translateX(${translateX}) rotateY(${rotateY}) scale(0.7)`,
        zIndex: 30,
        opacity: 0.6,
      }
    } else {
      // Far items - very small and heavily angled
      const rotateY = direction > 0 ? '-60deg' : '60deg'
      const translateX = direction > 0 ? '50%' : '-50%'
      return {
        transform: `translateX(${translateX}) rotateY(${rotateY}) scale(0.5)`,
        zIndex: 20,
        opacity: 0.3,
      }
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Navigation Buttons */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-[60] bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex" style={{ perspective: '1000px' }}>
          {items.map((item, index) => {
            const transformStyle = getItemTransform(index)
            
            return (
              <div
                key={item.id}
                className="flex-[0_0_20%] min-w-0 relative cursor-pointer transition-all duration-500 ease-out"
                style={{
                  ...transformStyle,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => {
                  if (index !== selectedIndex && emblaApi) {
                    emblaApi.scrollTo(index)
                  }
                }}
              >
                <div className="px-2">
                  {/* Item Title */}
                  <h3 className="font-serif text-sm font-semibold text-white mb-2 text-center transition-colors duration-300 whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.title}
                  </h3>
                  
                  {/* Item Image */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-contain rounded-lg shadow-2xl transition-all duration-500"
                      style={{
                        filter: index === selectedIndex ? 'brightness(1.1) contrast(1.1)' : 'brightness(0.8)',
                      }}
                    />
                    
                    {/* Selection indicator */}
                    {index === selectedIndex && (
                      <div className="absolute inset-0 rounded-lg ring-2 ring-yellow-300/60 pointer-events-none" />
                    )}
                    
                    {/* Reflection effect */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}