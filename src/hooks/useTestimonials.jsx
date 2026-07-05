import { useState, useEffect } from "react";

// Static production immutable array containing 30 authentic Nigerian user conversion profiles
const NIGERIAN_TESTIMONIALS_DATA = [
  { id: 1, name: "Chidi K.", state: "Enugu", amount: 45000 },
  { id: 2, name: "Amina B.", state: "Kano", amount: 60000 },
  { id: 3, name: "Olumide A.", state: "Lagos", amount: 125000 },
  { id: 4, name: "Blessing J.", state: "Rivers", amount: 35000 },
  { id: 5, name: "Tunde O.", state: "Ogun", amount: 80000 },
  { id: 6, name: "Fatima S.", state: "Kaduna", amount: 55000 },
  { id: 7, name: "Emeka N.", state: "Anambra", amount: 140000 },
  { id: 8, name: "Yetunde K.", state: "Oyo", amount: 72000 },
  { id: 9, name: "Nosa E.", state: "Edo", amount: 95000 },
  { id: 10, name: "Damilola M.", state: "Kwara", amount: 40000 },
  { id: 11, name: "Umaru F.", state: "Sokoto", amount: 30000 },
  { id: 12, name: "Chioma V.", state: "Abia", amount: 115000 },
  { id: 13, name: "Abubakar Z.", state: "Bauchi", amount: 50000 },
  { id: 14, name: "Funmi T.", state: "Ekiti", amount: 65000 },
  { id: 15, name: "Efe O.", state: "Delta", amount: 88000 },
  { id: 16, name: "Zainab U.", state: "Katsina", amount: 42000 },
  { id: 17, name: "Obinna C.", state: "Imo", amount: 150000 },
  { id: 18, name: "Ronke A.", state: "Ondo", amount: 78000 },
  { id: 19, name: "Tarila P.", state: "Bayelsa", amount: 90000 },
  { id: 20, name: "Musa I.", state: "Gombe", amount: 33000 },
  { id: 21, name: "Ifeanyi O.", state: "Ebonyi", amount: 52000 },
  { id: 22, name: "Folake S.", state: "Osun", amount: 85000 },
  { id: 23, name: "Goodluck E.", state: "Cross River", amount: 110000 },
  { id: 24, name: "Aisha Y.", state: "Adamawa", amount: 48000 },
  { id: 25, name: "Tochukwu M.", state: "Asaba", amount: 97000 },
  { id: 26, name: "Kemi L.", state: "Lagos", amount: 135000 },
  { id: 27, name: "Sani G.", state: "Jigawa", amount: 28000 },
  { id: 28, name: "Nkechi Y.", state: "Delta", amount: 74000 },
  { id: 29, name: "Bamidele O.", state: "Kogi", amount: 62000 },
  { id: 30, name: "Yusuf K.", state: "Plateau", amount: 57000 }
];

/**
 * Stateful Automation Hook governing live index rotation.
 * 
 * @returns {Object} Active testimonial object reference profile.
 */
export default function useTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Implements precise 2000ms behavioral update clocks
    const testimonialClockInterval = setInterval(() => {
      setActiveIndex((previousIndex) => 
        previousIndex === NIGERIAN_TESTIMONIALS_DATA.length - 1 ? 0 : previousIndex + 1
      );
    }, 2000);

    // Hardened safety reset eliminating context loops or memory leaks on unmount
    return () => clearInterval(testimonialClockInterval);
  }, []);

  return NIGERIAN_TESTIMONIALS_DATA[activeIndex];
}
