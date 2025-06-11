import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-[#1f2024] text-[#F3F7F5] py-8 mt-10 text-center text-sm">
  <p>&copy; Criado por Daniel Valpereiro 2025</p>
  <div className="mt-2">
    {["About", "Privacy Policy", "Licensing", "Contact"].map((item) => (
      <Link
        key={item}
        href={`/${item.toLowerCase().replace(" ", "-")}`}
        className="mx-2 text-[#4FA6A8] hover:underline"
        scroll={false}
      >
        {item}
      </Link>
    ))}
  </div>
</div>

  );
};

export default Footer;