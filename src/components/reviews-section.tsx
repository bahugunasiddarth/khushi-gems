import React from 'react';

const testimonials = [
  {
    id: 1,
    name: "Akanksha Khanna",
    age: 27,
    image: "https://res.cloudinary.com/dum5jqndc/image/upload/v1770311179/WhatsApp_Image_2026-02-05_at_2.45.13_PM_vk4tfp.jpg",
    text: "Looks like i’m ur brand ambassador, came for a wedding to udaipur, many people enquired abt the piece and I have given ur store name ",
    rotation: "md:-rotate-6", // Added responsive prefix
    marginTop: "md:mt-8",
  },
  {
    id: 2,
    name: "Nutan Mishra",
    age: 33,
    image: "https://res.cloudinary.com/dum5jqndc/image/upload/v1770311570/Gemini_Generated_Image_owd9fuowd9fuowd9_totjug.png",
    text: "Quality feels premium with flawless finishing, highly recommended for elegant, timeless and regal jewellery, loved it 💖",
    rotation: "md:rotate-3",
    marginTop: "md:mt-2",
  },
  {
    id: 3,
    name: "Divya Mishra",
    age: 26,
    image: "https://res.cloudinary.com/dum5jqndc/image/upload/v1770311368/Gemini_Generated_Image_k5mgxjk5mgxjk5mg_ilqeal.png",
    text: "Absolutely gorgeous necklace set, the kundan work is stunning with ruby drops giving a royal bridal look",
    rotation: "md:-rotate-3",
    marginTop: "md:mt-6",
  },
  {
    id: 4,
    name: "Anuska Ananya",
    age: 24,
    image: "https://res.cloudinary.com/dum5jqndc/image/upload/v1770311171/WhatsApp_Image_2026-02-05_at_2.45.29_PM_usnuyt.jpg",
    text: "Wore the choker for the first time today! Thankyou for the lovely piece",
    rotation: "md:rotate-6",
    marginTop: "md:mt-0",
  },
  {
    id: 5,
    name: "Priya Sharma",
    age: 29,
    image: "https://res.cloudinary.com/dum5jqndc/image/upload/v1770311867/Gemini_Generated_Image_s2n02gs2n02gs2n0_sixkoa.png",
    text: "I was looking for minimalist office wear and found the perfect stud earrings here. The packaging was beautiful and delivery was super fast!",
    rotation: "md:-rotate-2",
    marginTop: "md:mt-5",
  }, 
];

export default function ReviewsSection() {
  return (
    <section id="reviews-anchor" className="w-full bg-[hsl(40,83%,90.2%)] py-16 overflow-hidden relative">
      {/* Inline style to hide scrollbar but allow scrolling */}
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

        {/* MOBILE: flex-nowrap + overflow-x-auto + snap-x 
          DESKTOP: md:flex-wrap + md:justify-center
        */}
        <div className="hide-scrollbar relative z-10 flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none justify-start md:justify-center lg:justify-between items-start gap-6 md:gap-4 pb-8 px-4 md:px-2">
          
          {testimonials.map((item) => (
            <div 
              key={item.id}
              className={`
                relative 
                flex-shrink-0 /* Important for mobile scroll */
                snap-center  /* Smooth snapping on mobile */
                w-[85%]      /* Shows part of the next card on mobile */
                md:w-[45%]   /* 2 per row on tablets */
                lg:w-[18%]   /* 5 per row on desktop */
                max-w-[300px] 
                bg-[#fff5f7] p-3 pb-6 rounded-lg shadow-lg 
                transition-transform duration-300 hover:z-20 hover:scale-105
                ${item.rotation} ${item.marginTop}
              `}
            >
              <div className="w-full aspect-[4/3] overflow-hidden rounded-sm mb-4 border border-white/50 shadow-sm">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="px-1 text-left">
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-[#2e1065] font-bold text-lg leading-tight truncate">
                    {item.name},
                  </h3>
                  <span className="text-[#2e1065] text-lg font-normal">
                    {item.age}
                  </span>
                </div>
                
                <p className="text-gray-500 text-sm leading-relaxed font-light line-clamp-4">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}