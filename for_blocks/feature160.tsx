"use client";

import { Code, GitBranch, List, WandSparkles } from "lucide-react";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Feature160 = ({ className }: Feature160Props) => {
  const [cardNumber, setCardNumber] = useState(0);

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mb-20 max-w-lg">
          <h1 className="mb-4 text-6xl font-bold lg:text-[52px]">
            A CRM created to be your own.
          </h1>
          <h3 className="text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio,
            cupiditate commodi vitae nostrum facilis qui?
          </h3>
        </div>
        <Tabs
          className="border-opacity-100 rounded-3xl border border-gray-200 px-5 pt-4 sm:px-10 sm:pt-9"
          defaultValue="0"
        >
          <TabsList className="mb-14 grid !h-full grid-cols-1 gap-x-8 gap-y-6 bg-transparent p-0 md:grid-cols-2 lg:grid-cols-4">
            {integrations.map((item, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                onClick={() => setCardNumber(index)}
                className={`${index === cardNumber ? "opacity-100" : "opacity-50"} block cursor-pointer border-0 text-left whitespace-normal transition-all duration-500 hover:opacity-80 data-[state=active]:!shadow-none`}
              >
                <div className="mb-2 flex items-center gap-2">
                  {item.logo}
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                </div>
                <p className="text-base font-medium">{item.description}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="rounded-t-[28px] p-1 pb-0">
            {integrations.map((item, index) => (
              <TabsContent value={index.toString()} key={index} className="m-0">
                <img
                  src={item.image}
                  alt="logo"
                  className="h-full max-h-[400px] w-full rounded-t-[28px] object-cover object-bottom transition-all duration-500"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature160 };
