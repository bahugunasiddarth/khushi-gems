"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, CheckCircle, Award, Globe, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';

// Refined, smoother animations for a premium feel
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  viewport: { once: true }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" }
};

export default function AboutPage() {
  const router = useRouter();

  const expertise = [
    { 
      title: "Kundan Meena & Jadau Jewellery",
      description: "Preserving age-old techniques with unmatched detailing"
    },
    {
      title: "Polki & Diamond Jewellery",
      description: "Where raw elegance meets refined luxury"
    },
    {
      title: "Open Setting & Fusion Jewellery",
      description: "A perfect blend of tradition and modern aesthetics"
    },
    {
      title: "Traditional Indian & Designer Jewellery",
      description: "Crafted for celebrations, heirlooms, and timeless grace"
    },
    {
      title: "Silver Jewellery",
      description: "Versatile designs rooted in classic craftsmanship"
    },
  ];

  const values = [
    {
      title: "Authenticity",
      description: "Genuine craftsmanship with traditional techniques",
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      title: "Excellence",
      description: "Uncompromising quality in every detail",
      icon: <Award className="w-5 h-5" />
    },
    {
      title: "Heritage",
      description: "Preserving Jaipur's royal jewellery legacy",
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: "Global Reach",
      description: "Connecting traditional art with modern world",
      icon: <Globe className="w-5 h-5" />
    },
  ];

  const achievements = [
    { number: "25+", label: "Years of Excellence" },
    { number: "10+", label: "Countries Served" },
    { number: "5000+", label: "Happy Clients" },
    { number: "100%", label: "Handcrafted" },
  ];

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-20 relative">
        

        {/* Hero Section */}
        <motion.header 
          className="text-center mx-auto mb-24 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Since 2000</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-8 tracking-tight leading-[1.1]">
            Our Legacy,<br />
            <span className="font-headline"> Your Heirlooms</span>
          </h1>
          <div className="h-1 w-20 bg-primary/20 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Khushi Gems & Jewels—where Jaipur's heritage is transformed into masterpieces, handcrafted with tradition, inspired by royalty, and cherished worldwide.
          </p>
        </motion.header>

        {/* Achievement Stats - Clean Horizontal Divider Layout */}
        <motion.div 
          className="max-w-6xl mx-auto border-y border-border/60 py-10 mb-32 bg-background/30 backdrop-blur-sm"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`text-center ${index !== achievements.length -1 ? 'md:border-r border-border/60' : ''}`}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 text-primary tracking-tight">{item.number}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Craftsmanship Section */}
        <div className="mb-32 md:mb-40">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Image Side with decorative elements */}
            <motion.div {...fadeInUp} className="relative group">
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="https://i.ibb.co/pjcWqTmw/imgi-155-jal-mahal-jaipur-tour.png"
                  alt="Traditional jewellery craftsmanship"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Decorative Frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border border-border rounded-xl -z-0"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10"></div>
            </motion.div>
            
            {/* Text Side */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight font-headline">Handcrafted with Passion</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                   We specialize in an exquisite range of handcrafted fine jewellery, meticulously designed and crafted by skilled artisans at our in-house factory and manufacturing unit in Jaipur.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Our expertise spans across:</h3>
                  <div className="space-y-4">
                    {expertise.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-30 rounded-lg transition-colors group cursor-default">
                        <div className="mt-1.5 text-primary/40 group-hover:text-primary transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Values Section */}
        <motion.div 
          className="mb-32 md:mb-40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight font-headline">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Principles that guide every creation and relationship
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 border border-border/50 rounded-2xl bg-background/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/5 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Global Presence */}
        <div className="mb-32 md:mb-40">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div {...fadeInUp} className="order-2 lg:order-1">
              <div className="space-y-4">
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">From Jaipur to the World</h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-4">
                    Our craftsmanship has earned recognition far beyond Jaipur. <strong className="text-foreground">We actively participate in prestigious exhibitions across India, including Mumbai, Delhi, Ludhiana, Chandigarh, Hyderabad, Bangalore, Indore, Ahmedabad, and of course, Jaipur.</strong>
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                    <strong className="text-foreground">Internationally, we have successfully showcased our collections in the UAE</strong>, receiving outstanding customer appreciation and trust. Additionally, we are proud wholesalers of gold and silver jewellery, <strong className="text-foreground">supplying to reputed international brands in the United States</strong>, who retail our creations globally.
                </p>
              </div>
                
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="order-1 lg:order-2 relative">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="https://picsum.photos/seed/world/600/400"
                  alt="Global presence map"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -top-6 -right-6 w-24 h-24 border-t-2 border-r-2 border-primary/20 rounded-tr-3xl"></div>
            </motion.div>
          </div>
        </div>

        {/* Manufacturing Excellence */}
        <motion.div 
          className="mb-32 md:mb-40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight font-headline">Manufacturing Excellence</h2>
              <p className="text-muted-foreground text-lg">
                State-of-the-art facilities preserving traditional artistry
              </p>
            </div>
          </div>
          
          {/* Asymmetric Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
            <motion.div 
              className="col-span-2 row-span-2 relative rounded-xl overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Image
                src="https://i.ibb.co/v69hJkc2/imgi-156-dsc-0427.png"
                alt="Manufacturing process"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </motion.div>

            {[
              "https://picsum.photos/seed/factory2/400/300",
              "https://picsum.photos/seed/factory3/400/300",
            ].map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + (index * 0.1) }}
                className="relative rounded-xl overflow-hidden group"
              >
                <Image
                  src={src}
                  alt="Manufacturing process"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative rounded-xl overflow-hidden group col-span-2 md:col-span-1"
              >
                <Image
                  src="https://picsum.photos/seed/factory4/400/300"
                  alt="Manufacturing process"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
          </div>
        </motion.div>

        {/* Promise Section */}
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative py-12 px-6 rounded-3xl border border-primary/10 bg-primary/5 overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-primary/10 blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Our Promise</h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                At Khushi Gems & Jewels, we believe jewellery is more than adornment—it is a story, a legacy, and an emotion. With <strong className="text-foreground">complete control over design and manufacturing, we ensure uncompromised quality, ethical craftsmanship, and timeless designs</strong> that resonate across generations.
                
              </p>
              
              <div className="flex flex-col items-center gap-6">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base font-medium rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl"
                  onClick={() => router.push('/')}
                >
                  Explore Collections
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  Connect with our heritage, wear our legacy
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          className="mt-32 pt-10 border-t border-border/40 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Khushi Gems & Jewels • Jaipur, India • Est. 2000
          </p>
        </motion.div>
      </div>
    </div>
  );
}