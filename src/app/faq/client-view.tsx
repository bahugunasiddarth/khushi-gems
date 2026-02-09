"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion";

const faqs = [
    {
        question: "Where is your jewellery made?",
        answer: "All our jewellery is handcrafted in our own workshop in Johari Bazar, Jaipur — a world-renowned hub for gold, silver, polki, kundan-meena, and jadau craftsmanship.\nWith generations of skilled karigars, we blend traditional royal artistry with our modern design sensibility to create timeless bridal and fine jewellery."
    },
    {
        question: "What is your jewellery made of?",
        answer: "We exclusively work with pure gold and 92.5 sterling silver, ensuring authenticity, quality, and lasting value in every piece."
    },
    {
        question: "How can I pay for my order?",
        answer: "You can pay securely using Indian or international credit/debit cards and net banking (India).\nCash on Delivery is currently unavailable.\nFor payment assistance or international transaction queries, please contact Mr. Anil Soni: +91 9928070606."
    },
    {
        question: "How soon can I get my order?",
        answer: "Each piece is made to order. Crafting takes 3–4 weeks, followed by a personal quality check before dispatch.\nThe total delivery timeline is approximately 3–5 weeks.\nOur team stays in touch with you throughout the process."
    },
    {
        question: "Can I customise orders?",
        answer: "Yes. We offer complete customisation—design, artwork, craftsmanship, and even alternative metals like copper, if required. Every detail can be tailored to your preference."
    },
    {
        question: "Can I exchange or return my order?",
        answer: "Our jewellery is handmade, so slight variations in finish, stone shade, or detailing are natural and part of the craft.\nIf your item arrives damaged or incorrect, please share photos within 14 days of delivery via WhatsApp or call +91 9928070606 for assistance."
    },
    {
        question: "Can I get a refund or exchange my purchase?",
        answer: "We do not offer refunds or exchanges on made-to-order jewellery.\nHowever, exchanges may be considered after discussion, depending on the item purchased."
    }
];

const itemAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" }
};

export default function FaqClient() {
  return (
    <motion.div 
      className="container mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header className="text-center mb-12" {...itemAnimation}>
        <h1 className="font-headline text-5xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Find answers to common questions about our jewellery and services.
        </p>
      </motion.header>
      <div className="max-w-2xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                 <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                 >
                    <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                           <div className="space-y-4">
                                {faq.answer.split('\n').map((line, i) => (
                                    line.trim() && <p key={i}>{line}</p>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                 </motion.div>
            ))}
        </Accordion>
      </div>
    </motion.div>
  );
}