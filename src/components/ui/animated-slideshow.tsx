"use client"

import * as React from "react"
import { HTMLMotionProps, MotionConfig, motion } from "motion/react"
import { cn } from "@/lib/utils"

interface TextStaggerHoverProps {
    text: string
    index: number
}
interface HoverSliderImageProps {
    index: number
    imageUrl: string
}
interface HoverSliderProps { }
interface HoverSliderContextValue {
    activeSlide: number
    changeSlide: (index: number) => void
}
function splitText(text: string) {
    const words = text.split(" ").map((word) => word.concat(" "))
    const characters = words.map((word) => word.split("")).flat(1)

    return {
        words,
        characters,
    }
}

const HoverSliderContext = React.createContext<
    HoverSliderContextValue | undefined
>(undefined)
function useHoverSliderContext() {
    const context = React.useContext(HoverSliderContext)
    if (context === undefined) {
        throw new Error(
            "useHoverSliderContext must be used within a HoverSliderProvider"
        )
    }
    return context
}

export const HoverSlider = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement> & HoverSliderProps
>(({ children, className, ...props }, ref) => {
    const [activeSlide, setActiveSlide] = React.useState<number>(0)
    const changeSlide = React.useCallback(
        (index: number) => setActiveSlide(index),
        [setActiveSlide]
    )
    return (
        <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
            <div className={className}>{children}</div>
        </HoverSliderContext.Provider>
    )
})
HoverSlider.displayName = "HoverSlider"

const WordStaggerHover = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ children, className, ...props }, ref) => {
    return (
        <span
            className={cn("relative inline-block origin-bottom overflow-hidden")}
            {...props}
        >
            {children}
        </span>
    )
})
WordStaggerHover.displayName = "WordStaggerHover"

export const TextStaggerHover = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & TextStaggerHoverProps
>(({ text, index, children, className, ...props }, ref) => {
    const { activeSlide, changeSlide } = useHoverSliderContext()
    const { characters } = splitText(text)
    const isActive = activeSlide === index

    // Track touch start position to distinguish tap vs scroll
    const touchStartY = React.useRef<number>(0)
    const touchStartX = React.useRef<number>(0)
    const didScroll = React.useRef<boolean>(false)

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
        touchStartY.current = e.touches[0].clientY
        touchStartX.current = e.touches[0].clientX
        didScroll.current = false
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current)
        const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current)
        // If finger moved more than 10px in any direction, treat it as scroll
        if (deltaY > 10 || deltaX > 10) {
            didScroll.current = true
        }
    }

    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
        // Only change slide if it was a real tap (not a scroll)
        if (!didScroll.current) {
            e.preventDefault()
            changeSlide(index)
        }
    }

    return (
        <button
            type="button"
            ref={ref}
            className={cn(
                "relative inline-block origin-bottom overflow-hidden text-left bg-transparent border-none p-0 outline-none touch-manipulation cursor-pointer select-none",
                className
            )}
            onMouseEnter={(e) => { changeSlide(index) }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            {...props}
        >
            {characters.map((char, charIdx) => (
                <span
                    key={`${char}-${charIdx}`}
                    className="relative inline-block overflow-hidden"
                >
                    <MotionConfig
                        transition={{
                            delay: charIdx * 0.025,
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                    >
                        <motion.span
                            className="inline-block opacity-20"
                            initial={{ y: "0%" }}
                            animate={isActive ? { y: "-110%" } : { y: "0%" }}
                        >
                            {char}
                            {char === " " && charIdx < characters.length - 1 && <>&nbsp;</>}
                        </motion.span>

                        <motion.span
                            className="absolute left-0 top-0 inline-block opacity-100"
                            initial={{ y: "110%" }}
                            animate={isActive ? { y: "0%" } : { y: "110%" }}
                        >
                            {char}
                        </motion.span>
                    </MotionConfig>
                </span>
            ))}
        </button>
    )
})
TextStaggerHover.displayName = "TextStaggerHover"

export const clipPathVariants = {
    visible: {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    hidden: {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)",
    },
}
export const HoverSliderImageWrap = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full",
                className
            )}
            {...props}
        />
    )
})
HoverSliderImageWrap.displayName = "HoverSliderImageWrap"

export const HoverSliderImage = React.forwardRef<
    HTMLImageElement,
    HTMLMotionProps<"img"> & HoverSliderImageProps
>(({ index, imageUrl, children, className, ...props }, ref) => {
    const { activeSlide } = useHoverSliderContext()
    return (
        <motion.img
            className={cn("inline-block align-middle", className)}
            transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
            variants={clipPathVariants}
            animate={activeSlide === index ? "visible" : "hidden"}
            ref={ref}
            {...props}
        />
    )
})
HoverSliderImage.displayName = "HoverSliderImage"
