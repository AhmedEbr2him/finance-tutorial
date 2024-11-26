import { Loader } from 'lucide-react'
import React from 'react'

const LoadingPage = () => {
  return (
    <div className=' min-h-screen flex items-center justify-center '>

      <Loader className='size-20 animate-spin text-muted-foreground font-bold' />
    </div>
  )
}

export default LoadingPage