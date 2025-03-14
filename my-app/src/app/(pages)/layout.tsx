import React from 'react'
import SubFooter from '@/components/SubFooter'

interface CheckoutLayoutProps {
    children : React.ReactNode
}

const CheckoutLayout:React.FC<CheckoutLayoutProps> = (props) => {
  return (
    <div>
  
        {props.children}
        <SubFooter />
    </div>
  )
}

export default CheckoutLayout