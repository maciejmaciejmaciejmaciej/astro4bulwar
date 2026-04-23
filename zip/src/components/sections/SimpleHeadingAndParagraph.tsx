"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface SimpleHeadingAndParagraphProps {
  content?: SimpleHeadingAndParagraphContent;
  className?: string;
}

export interface SimpleHeadingAndParagraphContent {
  eyebrow: string;
  title: string;
  richTextHtml: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const escapeHtml = (value: string): string => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
};

const restoreAllowedTags = (value: string): string => {
  return value
    .replace(/&lt;(\/?)(strong|b|em|i|u|p|ul|ol|li)\s*&gt;/gi, "<$1$2>")
    .replace(/&lt;br\s*\/?\s*&gt;/gi, "<br>");
};

export const sanitizeSimpleRichTextHtml = (value: string): string => {
  return restoreAllowedTags(escapeHtml(value));
};

export const DEFAULT_SIMPLE_HEADING_AND_PARAGRAPH_CONTENT: SimpleHeadingAndParagraphContent = {
  eyebrow: "Polityka prywatności",
  title: "Jak przetwarzamy dane osobowe",
  richTextHtml:
    "<p><strong>Administrator danych</strong> przetwarza dane osobowe w zakresie niezbednym do obslugi kontaktu, zapytan oraz zamowien skladanych przez klientow.</p><p>W tej sekcji mozna opisac cele przetwarzania danych, okres ich przechowywania oraz prawa osob, ktorych dane dotycza.</p><ul><li>kontakt telefoniczny i mailowy</li><li>realizacja zamowien</li><li>obsluga formularzy i zapytan</li></ul>",
};

export function SimpleHeadingAndParagraph({
  content = DEFAULT_SIMPLE_HEADING_AND_PARAGRAPH_CONTENT,
  className,
}: SimpleHeadingAndParagraphProps) {
  return (
    <section className={cn("bg-white py-24 text-on-surface page-margin md:py-32", className)}>
      <motion.div
        className="mx-auto max-w-screen-2xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.header
          className="border-b border-outline-variant/35 pb-12 md:pb-16"
          variants={itemVariants}
        >
          <div className="max-w-4xl space-y-6">
            <p className="font-label text-xs uppercase text-zinc-500">
              {content.eyebrow}
            </p>
            <div className="space-y-4">
              <h2 className="font-headline text-4xl uppercase md:text-6xl">
                {content.title}
              </h2>
              <div className="h-px w-12 bg-primary" />
            </div>
          </div>
        </motion.header>

        <motion.div className="max-w-4xl pt-12 md:pt-16" variants={itemVariants}>
          <div
            className="font-body text-base text-zinc-500 md:text-lg [&_em]:italic [&_i]:italic [&_li]:mb-2 [&_li]:ml-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_u]:underline [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{
              __html: sanitizeSimpleRichTextHtml(content.richTextHtml),
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}