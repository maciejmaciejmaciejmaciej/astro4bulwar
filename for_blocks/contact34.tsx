"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface Contact34Props {
  title?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  image?: string;
  className?: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

const Contact34 = ({
  title = "Let's Build Something Great",
  tagline = "Contact",
  email = "studio@example.com",
  phone = "+1 (555) 000-0000",
  address = "123 Design Street, Creative District",
  image = "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modern%20Architectural%20Elegance%20at%20Twilight.png",
  className,
  onSubmit,
}: Contact34Props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        console.log("Form submitted:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setIsSubmitted(true);
      setShowSuccess(true);
      form.reset();
      setTimeout(() => setShowSuccess(false), 4500);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      form.setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Image Side */}
            <div className="relative lg:col-span-3">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={image}
                  alt=""
                  className="aspect-[4/3] w-full object-cover lg:aspect-[3/4]"
                />
              </div>
              <div className="absolute right-6 bottom-6 left-6 rounded-2xl bg-background/95 p-6 shadow-lg backdrop-blur-sm lg:right-8 lg:bottom-8 lg:left-8 lg:p-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      Email
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm hover:underline"
                    >
                      {email}
                    </a>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      Phone
                    </p>
                    <a
                      href={`tel:${phone}`}
                      className="text-sm hover:underline"
                    >
                      {phone}
                    </a>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      Address
                    </p>
                    <p className="text-sm">{address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="flex flex-col justify-center lg:col-span-2">
              <div className="mb-8">
                <p className="mb-3 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                  {tagline}
                </p>
                <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
                  {title}
                </h1>
              </div>

              {isSubmitted && (
                <div
                  className={cn(
                    "mb-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center transition-opacity duration-500",
                    showSuccess ? "opacity-100" : "opacity-0",
                  )}
                >
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Message sent successfully!
                  </p>
                </div>
              )}

              <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Your name"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Email <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="you@example.com"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="message"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Message <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Tell us about your project..."
                          rows={5}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {form.formState.errors.root && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.root.message}
                    </p>
                  )}

                  <Button
                    size="lg"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <LoaderIcon className="mr-2 size-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowUpRight className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Contact34 };
