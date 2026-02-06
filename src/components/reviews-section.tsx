import React from 'react';

const testimonials = [
  {
    id: 1,
    name: "Deepa subramanian",
    image: "https://res.cloudinary.com/dum5jqndc/image/upload/v1770311179/WhatsApp_Image_2026-02-05_at_2.45.13_PM_vk4tfp.jpg",
    text: "Looks like i’m ur brand ambassador, came for a wedding to udaipur, many people enquired abt the piece and I have given ur store name ",
    rotation: "md:-rotate-6",
    marginTop: "md:mt-8",
  },
  {
    id: 2,
    name: "Ritu yadav",
    image: "https://res.cloudinary.com/dum5jqndc/image/upload/v1770364424/WhatsApp_Image_2026-02-06_at_1.18.23_PM_fjondw.jpg",
    text: "Quality feels premium with flawless finishing, highly recommended for elegant, timeless and regal jewellery, loved it 💖",
    rotation: "md:rotate-3",
    marginTop: "md:mt-2",
  },
  {
    id: 3,
    name: "Puja gupta",
    image: "https://res.cloudinary.com/dum5jqndc/image/upload/v1770365879/WhatsApp_Image_2026-02-06_at_1.41.30_PM_1_sp9kvi.jpg",
    text: "Gold diamond studs “They are beautiful, i love it”",
    rotation: "md:-rotate-3",
    marginTop: "md:mt-6",
    isVideo: false,
  },
  {
    id: 4,
    name: "Jaansi reddy",
    image: "https://res.cloudinary.com/dum5jqndc/image/upload/v1770364423/WhatsApp_Image_2026-02-06_at_1.17.44_PM_hmsalj.jpg",
    text: "I wore all this jewellery for my sister’s wedding and it made me feel absolutely beautiful.",
    rotation: "md:-rotate-2",
    marginTop: "md:mt-5",
  },
  {
    id: 5,
    name: "Deepa",
    image: "https://res.cloudinary.com/dum5jqndc/image/upload/v1770311171/WhatsApp_Image_2026-02-05_at_2.45.29_PM_usnuyt.jpg",
    text: "Wore the choker for the first time today! Thankyou for the lovely piece",
    rotation: "md:rotate-6",
    marginTop: "md:mt-0",
  },
   
];

export default function ReviewsSection() {
  return (
    <section id="reviews-anchor" className="w-full bg-[hsl(40,83%,90.2%)] py-16 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <span className="text-[#D4AF37] font-medium tracking-widest text-sm uppercase">Testimonials</span>
            <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-headline text-[#000000] mb-4 tracking-tight px-4">
            Customer Reviews You Can Trust
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light px-4">
            Join thousands of satisfied customers who found their perfect jewelry pieces
          </p>
        </div>

        {/* 5 in horizontal for desktop (lg:justify-between) */}
        <div className="hide-scrollbar relative z-10 flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none justify-start lg:justify-between items-start gap-5 md:gap-4 pb-12 px-4 md:px-0">
          
          {testimonials.map((item) => (
            <div 
              key={item.id}
              className={`
                relative flex-shrink-0 snap-center 
                w-[280px] md:w-[45%] lg:w-[19%]
                bg-[#fff5f7] p-4 pb-8 rounded-lg shadow-md
                border border-[#D4AF37]/20
                transition-all duration-300 hover:z-20 hover:-translate-y-2 hover:shadow-xl hover:border-[#D4AF37]/50
                ${item.rotation} ${item.marginTop}
              `}
            >
              {/* Increased Image/Video Container Size */}
              <div className="w-full aspect-[4/5] overflow-hidden rounded-md mb-4 border border-white shadow-inner bg-black/5">
                {item.isVideo ? (
                  <video 
                    src={item.image} 
                    className="w-full h-full object-cover"
                    controls
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                  />
                )}
              </div>

              <div className="px-1 text-left">
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-[#2e1065] font-bold text-lg leading-tight truncate">
                    {item.name}
                  </h3>
                </div>
                
                <p className="text-gray-500 text-sm leading-relaxed font-light line-clamp-5">
                  {item.text}
                </p>
              </div>
              
              {/* Premium Decoration: Small Gold Corner */}
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#D4AF37]/30 rounded-tr-md"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}