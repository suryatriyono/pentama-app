"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { FaGraduationCap } from "react-icons/fa";

export function PentamaLogoWithParticles() {  
  const [isHovered, setIsHovered] = useState(false);  

  // Tipe Variants yang benar  
  const particleVariants: Variants = {  
    hidden: {   
      opacity: 0,   
      scale: 0,  
      x: 0,  
      y: 0  
    },  
    visible: (index: number) => ({   
      opacity: [0, 1, 0],  
      scale: [0, 1, 0],  
      x: [  
        Math.random() * 50 - 25,   
        Math.random() * 100 - 50,   
        0  
      ],  
      y: [  
        Math.random() * 50 - 25,   
        Math.random() * 100 - 50,   
        0  
      ],  
      transition: {  
        duration: 1.5,  
        delay: index * 0.1,  
        repeat: Infinity,  
        repeatType: "mirror"  
      }  
    })  
  };  

  return (  
    <motion.div   
      className="relative flex items-center gap-2 cursor-pointer select-none"  
      whileHover={{  
        scale: 1.05,  
        transition: { duration: 0.3 }  
      }}  
      whileTap={{ scale: 0.95 }}  
      onMouseEnter={() => setIsHovered(true)}  
      onMouseLeave={() => setIsHovered(false)}  
    >  
      {/* Particle Effects */}  
      {isHovered && (  
        <>  
          {[...Array(8)].map((_, index) => (  
            <motion.div  
              key={index}  
              className="absolute w-2 h-2 bg-indigo-200/50 rounded-full"  
              initial="hidden"  
              animate="visible"  
              variants={particleVariants}  
              custom={index}  
              style={{  
                position: 'absolute',  
                zIndex: -1  
              }}  
            />  
          ))}  
        </>  
      )}  

      <motion.div  
        animate={{   
          rotate: isHovered   
            ? [0, -15, 15, 0]   
            : 0,  
          scale: isHovered ? 1.1 : 1  
        }}  
        transition={{  
          rotate: {  
            duration: 2,  
            repeat: Infinity,  
            repeatType: "mirror",  
            ease: "easeInOut"  
          },  
          scale: {   
            duration: 0.3,  
            type: "spring"   
          }  
        }}  
      >  
        <FaGraduationCap   
          className={`  
            text-3xl   
            ${isHovered ? 'text-white' : 'text-indigo-100'}  
            transition-colors duration-300  
            drop-shadow-[0_0_5px_rgba(59,130,246,0.7)]  
          `}  
        />  
      </motion.div>  
      
      <motion.span  
        className="text-2xl font-bold text-cyan-300 tracking-wider"  
      >  
        {"PENTAMA".split('').map((char, index) => (  
          <motion.span  
            key={index}  
            animate={{   
              opacity: 1,   
              y: 0,  
              color: isHovered   
                ? "oklch(90.54% 0.15455 194.7689)" // blue-600  
                : "oklch(0.93 0.034 272.788)", // gray-800  
              scale: isHovered ? 1.05 : 1,  
            }}  
            transition={{  
              delay: index * 0.05,  
              duration: 0.3,  
              type: "spring",  
              stiffness: 300  
            }}  
            style={{   
              display: 'inline-block',  
              transformOrigin: 'center'  
            }}  
          >  
            {char}  
          </motion.span>  
        ))}  
      </motion.span>  
    </motion.div>  
  );  
}  