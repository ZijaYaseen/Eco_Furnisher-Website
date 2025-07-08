import React from 'react'
import SubFooter from '@/components/SubFooter'
import Footer from '@/components/Footer'

interface CheckoutLayoutProps {
    children : React.ReactNode
}

const CheckoutLayout:React.FC<CheckoutLayoutProps> = (props) => {
  return (
    <div>
  
        {props.children}
        <SubFooter />
        <Footer />
    
    </div>
  )
}

export default CheckoutLayout