// @flow strict

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";


function AboutSection() {
  return (
    <div id="about" className="my-12 lg:my-16 relative">
      <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8">
        <span className="bg-[#1a1443] w-fit gradient-text rotate-90 p-2 px-5 text-xl rounded-md">
          ABOUT US
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="font-medium mb-5 gradient-text text-xl uppercase">
            Who we are?
          </p>
          <p className="gradient-text text-sm lg:text-lg">
            CogniSphere is a leading provider of cutting-edge AI solutions designed to transform businesses. We specialize in leveraging the power of artificial intelligence to drive innovation, optimize operations, and create intelligent systems that deliver tangible results. Our team of expert AI engineers and data scientists are dedicated to developing tailored solutions that address your unique challenges and unlock new opportunities for growth. From machine learning models and natural language processing to computer vision and predictive analytics, we empower businesses across industries to harness the full potential of AI and stay ahead in today's rapidly evolving digital landscape.
          </p>
        </div>
        <div className="flex justify-center order-1 lg:order-2">
          <Image
            src="/image/ChatGPT Image Apr 29, 2025, 03_06_38 AM.png"
            width={280}
            height={280}
            alt="Logo"
            className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
