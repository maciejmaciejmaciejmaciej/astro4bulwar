import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type Contact34Image = {
  src: string;
  alt: string;
};

export type Contact34ContactItem = {
  label: string;
  value: string;
  href?: string;
};

export type Contact34FormContent = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
};

export type Contact34Content = {
  tagline: string;
  title: string;
  image: Contact34Image;
  contactItems: Contact34ContactItem[];
  form: Contact34FormContent;
};

export const DEFAULT_CONTACT34_CONTENT: Contact34Content = {
  tagline: "Kontakt",
  title: "Porozmawiajmy o Twoim wydarzeniu",
  image: {
    src: "/react/images/widok-na-ratusz.jpg",
    alt: "Przestrzeń restauracji widziana z zewnątrz",
  },
  contactItems: [
    {
      label: "Email",
      value: "rezerwacje@bulwarrestauracja.pl",
      href: "mailto:rezerwacje@bulwarrestauracja.pl",
    },
    {
      label: "Telefon",
      value: "+48 533 181 171",
      href: "tel:+48533181171",
    },
    {
      label: "Adres",
      value: "Stary Rynek 37, Poznań",
    },
  ],
  form: {
    nameLabel: "Imię i nazwisko",
    namePlaceholder: "Twoje imię i nazwisko",
    emailLabel: "Email",
    emailPlaceholder: "twoj@email.pl",
    messageLabel: "Wiadomość",
    messagePlaceholder: "Napisz, czego potrzebujesz...",
    submitLabel: "Wyślij wiadomość",
  },
};

interface Contact34SectionProps {
  content?: Contact34Content;
  className?: string;
}

export const Contact34Section = ({
  content = DEFAULT_CONTACT34_CONTENT,
  className,
}: Contact34SectionProps) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="theme-section-wrapper">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="relative lg:col-span-3">
              <div className="overflow-hidden rounded-[4px]">
                <img
                  src={content.image.src}
                  alt={content.image.alt}
                  className="aspect-[4/3] w-full object-cover lg:aspect-[3/4]"
                />
              </div>
              <div className="absolute right-6 bottom-6 left-6 rounded-[4px] bg-background/95 p-6 shadow-lg backdrop-blur-sm lg:right-8 lg:bottom-8 lg:left-8 lg:p-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  {content.contactItems.map((item) => (
                    <div key={`${item.label}-${item.value}`}>
                      <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a href={item.href} className="text-sm hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-2">
              <div className="mb-8">
                <p className="mb-3 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                  {content.tagline}
                </p>
                <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                  {content.title}
                </h2>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {content.form.nameLabel}
                  </label>
                  <input
                    className="w-full rounded-[4px] border border-border bg-background px-4 py-3"
                    placeholder={content.form.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {content.form.emailLabel}
                  </label>
                  <input
                    className="w-full rounded-[4px] border border-border bg-background px-4 py-3"
                    placeholder={content.form.emailPlaceholder}
                    type="email"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {content.form.messageLabel}
                  </label>
                  <textarea
                    className="min-h-32 w-full rounded-[4px] border border-border bg-background px-4 py-3"
                    placeholder={content.form.messagePlaceholder}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-[4px] bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {content.form.submitLabel}
                  <ArrowUpRight className="ml-2 size-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export type { Contact34SectionProps };