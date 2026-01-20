import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/khushigems.png"    
        alt="Khushi Gems and Jewellery"
        width={100}       
        height={0}
        priority           
      />
    </Link>
  );
}