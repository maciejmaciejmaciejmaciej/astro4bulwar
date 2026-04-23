import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"

import { cn } from "@/lib/utils"

type CarouselViewportRef = ReturnType<typeof useEmblaCarousel>[0]
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0]
export type CarouselPlugins = NonNullable<Parameters<typeof useEmblaCarousel>[1]>

interface CarouselContextValue {
  viewportRef: CarouselViewportRef
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

interface CarouselProps extends React.ComponentPropsWithoutRef<"div"> {
  opts?: CarouselOptions
  plugins?: CarouselPlugins
}

function Carousel({ className, opts, plugins, children, ...props }: CarouselProps) {
  const [viewportRef] = useEmblaCarousel(opts, plugins)

  return (
    <CarouselContext.Provider value={{ viewportRef }}>
      <div className={cn("relative", className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, children, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("CarouselContent must be used within Carousel")
  }

  return (
    <div ref={context.viewportRef} className="overflow-hidden">
      <div className={cn("flex", className)} {...props}>
        {children}
      </div>
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      role="group"
      {...props}
    />
  )
}

export { Carousel, CarouselContent, CarouselItem }