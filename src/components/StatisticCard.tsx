import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

interface StatisticCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  expandedInfo?: string;
}

const StatisticCard = ({ value, label, icon, className, expandedInfo }: StatisticCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        "bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-brand-teal/10 border-2 border-[rgb(87,155,142)]",
        "flex flex-col items-center text-center transition-all duration-300",
        "hover-lift cursor-pointer min-h-[250px]",
        isHovered && "shadow-2xl shadow-brand-teal/30",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        <div 
          className={cn(
            "transition-all duration-300 flex flex-col items-center",
            isHovered ? "opacity-0" : "opacity-100"
          )}
        >
          {icon && <div className="text-brand-teal mb-4">{icon}</div>}
          <div className="text-3xl md:text-4xl font-bold text-brand-teal mb-2 font-heading">
            {value}
          </div>
          <div className="text-sm text-brand-dark/70 uppercase tracking-wider font-medium">
            {label}
          </div>
        </div>

        {expandedInfo && (
          <div 
            className={cn(
              "absolute inset-0 flex flex-col justify-center transition-all duration-300 px-4",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="text-2xl md:text-3xl font-bold text-brand-teal mb-2 font-heading">
              {value}
            </div>
            <div className="text-sm text-brand-dark/70 uppercase tracking-wider font-medium mb-4">
              {label}
            </div>
            <p className="text-brand-dark/80 text-sm leading-relaxed">
              {expandedInfo}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatisticCard;
