"use client";

import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import {
  createContext,
  useContext,
  useId,
  useState,
} from "react";

import { Code, GitBranch, List, WandSparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const integrations = [
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/tim-van-der-kuip-CPs2X8JYmS8-unsplash.jpg",
    logo: <Code strokeWidth={1} className="h-5 w-5" />,
    title: "Build",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas laboriosam, tempore amet esse",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/vitaly-gariev-y7xUr3aDLXc-unsplash.jpg",
    logo: <GitBranch strokeWidth={1} className="h-5 w-5" />,
    title: "Refine",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas laboriosam, tempore amet esse",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
    logo: <List strokeWidth={1} className="h-5 w-5" />,
    title: "Work",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas laboriosam, tempore amet esse",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/akson-1K8pIbIrhkQ-unsplash.jpg",
    logo: <WandSparkles strokeWidth={1} className="h-5 w-5" />,
    title: "Report",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas laboriosam, tempore amet esse",
  },
];

interface Feature160Props {
  className?: string;
}

export const Feature160 = ({ className }: Feature160Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="theme-section-wrapper">
        <div className="mb-20 max-w-lg">
          <h1 className="mb-4 text-6xl lg:text-[52px]">
            A CRM created to be your own.
          </h1>
          <h3 className="text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio,
            cupiditate commodi vitae nostrum facilis qui?
          </h3>
        </div>
        <Tabs
          className="rounded-3xl border border-gray-200 border-opacity-100 px-5 pt-4 sm:px-10 sm:pt-9"
          defaultValue="0"
        >
          <TabsList className="mb-14 grid !h-full grid-cols-1 gap-x-8 gap-y-6 bg-transparent p-0 md:grid-cols-2 lg:grid-cols-4">
            {integrations.map((item, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="block cursor-pointer border-0 text-left whitespace-normal opacity-50 transition-all duration-500 hover:opacity-80 data-[state=active]:!shadow-none data-[state=active]:opacity-100"
              >
                <div className="mb-2 flex items-center gap-2">
                  {item.logo}
                  <h4 className="text-lg">{item.title}</h4>
                </div>
                <p className="text-base">{item.description}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="rounded-t-[28px] p-1 pb-0">
            {integrations.map((item, index) => (
              <TabsContent
                value={index.toString()}
                key={index}
                className="m-0"
              >
                <img
                  src={item.image}
                  alt="logo"
                  className="h-full max-h-[400px] w-full rounded-t-[28px] object-cover object-bottom transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

interface TabsContextValue {
  activeValue: string;
  setActiveValue: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
}

const Tabs = ({ className, defaultValue, children, ...props }: TabsProps) => {
  const [activeValue, setActiveValue] = useState(defaultValue);
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue, baseId }}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return <div role="tablist" className={cn(className)} {...props} />;
};

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = ({
  className,
  value,
  onClick,
  children,
  ...props
}: TabsTriggerProps) => {
  const context = useTabsContext();
  const isActive = context.activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${context.baseId}-${value}-tab`}
      aria-controls={`${context.baseId}-${value}-panel`}
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          context.setActiveValue(value);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = ({
  className,
  value,
  children,
  ...props
}: TabsContentProps) => {
  const context = useTabsContext();
  const isActive = context.activeValue === value;

  if (!isActive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`${context.baseId}-${value}-panel`}
      aria-labelledby={`${context.baseId}-${value}-tab`}
      data-state="active"
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
};

const useTabsContext = () => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used inside Feature160 Tabs.");
  }

  return context;
};