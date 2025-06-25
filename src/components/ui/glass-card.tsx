import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function GlassCard({ 
  children, 
  className = '', 
  hover = false,
  gradient = false,
  onClick 
}: GlassCardProps) {
  return (
    <div 
      className={cn(
        'relative backdrop-blur-xl rounded-2xl border border-white/10',
        'bg-white/5',
        hover && 'hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:transform hover:scale-[1.02]',
        gradient && 'bg-gradient-to-br from-purple-500/10 to-blue-500/10',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* グロー効果 */}
      {hover && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      )}
      
      {children}
    </div>
  );
}

interface GlassCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function GlassCardHeader({ title, subtitle, icon }: GlassCardHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      {icon && (
        <div className="text-purple-400 opacity-80">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-xl font-light text-white mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-white/60">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

interface GlassCardContentProps {
  children: ReactNode;
  className?: string;
}

export function GlassCardContent({ children, className = '' }: GlassCardContentProps) {
  return (
    <div className={cn('text-white/90', className)}>
      {children}
    </div>
  );
}