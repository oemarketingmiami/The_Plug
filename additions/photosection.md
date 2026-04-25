You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
flip-reveal.tsx
"use client";

import { ComponentProps, useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Flip from "gsap/Flip";

gsap.registerPlugin(Flip);

type FlipRevealItemProps = {
    flipKey: string;
} & ComponentProps<"div">;

export const FlipRevealItem = ({ flipKey, ...props }: FlipRevealItemProps) => {
    return <div data-flip={flipKey} {...props} />;
};

type FlipRevealProps = {
    keys: string[];
    showClass?: string;
    hideClass?: string;
} & ComponentProps<"div">;

export const FlipReveal = ({ keys, hideClass = "", showClass = "", ...props }: FlipRevealProps) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const isShow = (key: string | null) => !!key && (keys.includes("all") || keys.includes(key));

    useGSAP(
        () => {
            if (!wrapperRef.current) return;

            const items = gsap.utils.toArray<HTMLDivElement>(["[data-flip]"]);
            const state = Flip.getState(items);

            items.forEach((item) => {
                const key = item.getAttribute("data-flip");
                if (isShow(key)) {
                    item.classList.add(showClass);
                    item.classList.remove(hideClass);
                } else {
                    item.classList.remove(showClass);
                    item.classList.add(hideClass);
                }
            });

            Flip.from(state, {
                duration: 0.6,
                scale: true,
                ease: "power1.inOut",
                stagger: 0.05,
                absolute: true,
                onEnter: (elements) =>
                    gsap.fromTo(
                        elements,
                        { opacity: 0, scale: 0 },
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 0.8,
                        },
                    ),
                onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0, duration: 0.8 }),
            });
        },

        { scope: wrapperRef, dependencies: [keys] },
    );

    return <div {...props} ref={wrapperRef} />;
};


demo.tsx
"use client";

import { useState } from "react";

import { FlipReveal, FlipRevealItem } from "@/components/ui/flip-reveal";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const Demo = () => {
    const [key, setKey] = useState("all");

    return (
        <div className="flex min-h-120 flex-col items-center gap-8">
            <ToggleGroup
                type="single"
                className="bg-background rounded-md border p-1"
                value={key}
                onValueChange={(e) => setKey(e)}>
                <ToggleGroupItem value="all" className="sm:px-4">
                    All
                </ToggleGroupItem>
                <ToggleGroupItem value="shirt" className="sm:px-4">
                    Shirt
                </ToggleGroupItem>
                <ToggleGroupItem value="goggles" className="sm:px-4">
                    Goggles
                </ToggleGroupItem>
                <ToggleGroupItem value="shoes" className="sm:px-4">
                    Shoes
                </ToggleGroupItem>
            </ToggleGroup>
            <FlipReveal className="grid grid-cols-3 gap-3 sm:gap-4" keys={[key]} showClass="flex" hideClass="hidden">
                <FlipRevealItem flipKey="shirt">
                    <img
                        src="https://images.unsplash.com/photo-1696086152504-4843b2106ab4?q=80&w=300"
                        alt="Shirt"
                        className="size-20 rounded-md sm:size-24 xl:size-32"
                    />
                </FlipRevealItem>
                <FlipRevealItem flipKey="goggles">
                    <img
                        src="https://images.unsplash.com/photo-1648688135643-2716ec8f4b24?q=80&w=300"
                        alt="Goggles"
                        className="size-20 rounded-md sm:size-24 xl:size-32"
                    />
                </FlipRevealItem>
                <FlipRevealItem flipKey="shoes">
                    <img
                        src="https://images.unsplash.com/photo-1631984564919-1f6b2313a71c?q=80&w=300"
                        alt="Shoes"
                        className="size-20 rounded-md sm:size-24 xl:size-32"
                    />
                </FlipRevealItem>
                <FlipRevealItem flipKey="goggles">
                    <img
                        src="https://images.unsplash.com/photo-1632168844625-b22d7b1053c0?q=80&w=300"
                        alt="Goggles"
                        className="size-20 rounded-md sm:size-24 xl:size-32"
                    />
                </FlipRevealItem>
                <FlipRevealItem flipKey="shirt">
                    <img
                        src="https://images.unsplash.com/photo-1583656346517-4716a62e27b7?q=80&w=300"
                        alt="Shirt"
                        className="size-20 rounded-md sm:size-24 xl:size-32"
                    />
                </FlipRevealItem>
                <FlipRevealItem flipKey="shoes">
                    <img
                        src="https://images.unsplash.com/photo-1596480370804-cff0eed14888?q=80&w=300"
                        alt="Shoes"
                        className="size-20 rounded-md sm:size-24 xl:size-32"
                    />
                </FlipRevealItem>
                <FlipRevealItem flipKey="shirt">
                    <img
                        src="https://images.unsplash.com/photo-1740711152088-88a009e877bb?q=80&w=300"
                        alt="Goggles"
                        className="size-20 rounded-md sm:size-24 xl:size-32"
                    />
                </FlipRevealItem>{" "}
                <FlipRevealItem flipKey="shoes">
                    <img
                        src="https://images.unsplash.com/photo-1696086152508-1711cc7bcc9d?q=80&w=300"
                        alt="Shoes"
                        className="size-20 rounded-md sm:size-24 xl:size-32"
                    />
                </FlipRevealItem>
                <FlipRevealItem flipKey="goggles">
                    <img
                        src="https://images.unsplash.com/photo-1684790369514-f292d2dffc11?q=80&w=300"
                        alt="Goggles"
                        className="size-20 rounded-md sm:size-24 xl:size-32"
                    />
                </FlipRevealItem>
            </FlipReveal>
        </div>
    );
};

export default Demo;
```

Copy-paste these files for dependencies:
```tsx
shadcn/toggle-group
"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }

```
```tsx
shadcn/toggle
"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

```

Install NPM dependencies:
```bash
gsap, @gsap/react, class-variance-authority, @radix-ui/react-toggle-group, @radix-ui/react-toggle
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
