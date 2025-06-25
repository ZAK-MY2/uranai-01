'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'float';
  delay?: number;
  duration?: number;
  className?: string;
  infinite?: boolean;
}

export function AnimatedContainer({
  children,
  animation = 'fade',
  delay = 0,
  duration = 1000,
  className = '',
  infinite = false
}: AnimatedContainerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const animationClasses = {
    fade: {
      initial: 'opacity-0',
      animate: 'opacity-100',
      transition: `transition-opacity duration-${duration}`
    },
    slide: {
      initial: 'opacity-0 translate-y-8',
      animate: 'opacity-100 translate-y-0',
      transition: `transition-all duration-${duration}`
    },
    scale: {
      initial: 'opacity-0 scale-95',
      animate: 'opacity-100 scale-100',
      transition: `transition-all duration-${duration}`
    },
    float: {
      initial: '',
      animate: infinite ? 'animate-float' : '',
      transition: ''
    }
  };

  const selectedAnimation = animationClasses[animation];

  return (
    <div 
      className={cn(
        selectedAnimation.transition,
        isVisible ? selectedAnimation.animate : selectedAnimation.initial,
        className
      )}
    >
      {children}
      
      {animation === 'float' && infinite && (
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          :global(.animate-float) {
            animation: float ${duration * 3}ms ease-in-out infinite;
          }
        `}</style>
      )}
    </div>
  );
}

interface StaggeredContainerProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function StaggeredContainer({
  children,
  staggerDelay = 100,
  className = ''
}: StaggeredContainerProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimatedContainer
          key={index}
          animation="slide"
          delay={index * staggerDelay}
          duration={600}
        >
          {child}
        </AnimatedContainer>
      ))}
    </div>
  );
}