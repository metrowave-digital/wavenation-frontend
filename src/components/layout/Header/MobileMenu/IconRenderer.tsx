import React from 'react'
import { LucideProps } from 'lucide-react'
import { NAV_ICONS } from '../nav/iconLibrary'

interface IconRendererProps extends LucideProps {
  name: string
}

export const IconRenderer = ({ name, ...props }: IconRendererProps) => {
  // Look up the icon in our local allowed library
  const Icon = NAV_ICONS[name]

  if (!Icon) {
    // If icon is missing, we render nothing and log a helpful dev warning
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Icon "${name}" is missing from iconLibrary.ts`)
    }
    return null
  }

  return (
    <Icon 
      {...props} 
      size={props.size || 16} 
      strokeWidth={props.strokeWidth || 2}
      // currentColor ensures it inherits the color of the text/parent div
      color="currentColor" 
    />
  )
}