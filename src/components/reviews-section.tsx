import React from 'react';

const testimonials = [
  {
    id: 1,
    name: "Akanksha Khanna",
    age: 27,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    text: "Delighted with my engagement ring from BlueStone! It's my dream ring, fits perfectly and is stunning to look at. Thanks for helping us find the perfect symbol of love!",
    rotation: "-rotate-6",
    marginTop: "mt-8",
  },
  {
    id: 2,
    name: "Nutan Mishra",
    age: 33,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    text: "I got a Nazariya for my baby boy from BlueStone. It's so cute seeing it on my little one's wrist, and it gives me a sense of security knowing it's there.",
    rotation: "rotate-3",
    marginTop: "mt-2",
  },
  {
    id: 3,
    name: "Divya Mishra",
    age: 26,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    text: "On Valentine's Day, my husband gifted me a necklace. I haven't taken it off even once. Everyone asks me where it's from, and I just LOVE how nice it looks on me.",
    rotation: "-rotate-3",
    marginTop: "mt-6",
  },
  {
    id: 4,
    name: "Anuska Ananya",
    age: 24,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    text: "BlueStone is my go-to place for jewellery. I love that I can wear their jewellery to work, dates, parties and brunches; it goes with everything.",
    rotation: "rotate-6",
    marginTop: "mt-0",
  },
  // Added 5th Card
  {
    id: 5,
    name: "Priya Sharma",
    age: 29,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    text: "I was looking for minimalist office wear and found the perfect stud earrings here. The packaging was beautiful and delivery was super fast!",
    rotation: "-rotate-2",
    marginTop: "mt-5",
  },
];

const ClipIcon = () => (
  <svg 
    width="40" 
    height="50" 
    viewBox="0 0 40 50" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20"
    style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.1))' }}
  >
    <path 
      d="M10 35 L10 15 Q10 5 20 5 Q30 5 30 15 L30 35" 
      stroke="#9CA3AF" 
      strokeWidth="2" 
      fill="none"
    />
    <path 
      d="M5 35 L35 35 L30 45 L10 45 Z" 
      fill="none" 
      stroke="#9CA3AF" 
      strokeWidth="2"
    />
    <path d="M11 15 L11 30" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
  </svg>
);

export default function ReviewsSection() {
  return (
    <section id="reviews-anchor" className="w-full bg-[hsl(40,83%,90.2%)] py-16 overflow-hidden relative">
      <div className="container mx-auto px-4">
        
  <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <span className="text-[#D4AF37] font-medium tracking-widest text-sm uppercase">Testimonials</span>
            <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-headline text-[#000000] mb-4 tracking-tight">
            Customer Reviews You Can Trust
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
            Join thousands of satisfied customers who found their perfect jewelry pieces
          </p>
        </div>



        {/* String Background */}
        <div className="absolute top-[240px] left-0 w-full h-20 z-0 pointer-events-none hidden lg:block">
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <path 
              d="M0,10 Q500,40 1000,15 T14000,10" 
              fill="none" 
              stroke="#cbd5e1" 
              strokeWidth="2" 
            />
          </svg>
        </div>

        {/* Cards Container */}
        {/* Adjusted justify and gap to fit 5 items */}
        <div className="relative z-10 flex flex-wrap justify-center lg:justify-between items-start gap-4 px-2">
          
          {testimonials.map((item) => (
            <div 
              key={item.id}
              className={`
                relative 
                w-full 
                md:w-[45%]  /* 2 per row on tablets */
                lg:w-[18%]  /* 5 per row on desktop (approx 18% * 5 + gaps) */
                max-w-[300px] 
                bg-[#FFF0F5] p-3 pb-6 rounded-lg shadow-lg 
                transition-transform duration-300 hover:z-20 hover:scale-105
                ${item.rotation} ${item.marginTop}
              `}
              style={{ backgroundColor: '#fff5f7' }}
            >
              <ClipIcon />

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
                
                {/* Clamp text to 4 lines to ensure height consistency with 5 items */}
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