import PagesHeader from '@/components/PagesHeader'
import React from 'react'

interface IAccount {
    children : React.ReactNode
}

const AccountLayout:React.FC<IAccount> = (props) => {
  return (
    <div>
        <div className='mt-12 md:mt-24'>
        <PagesHeader name="Account" title="Account"/>
        </div>
        {props.children}
    </div>
  )
}

export default AccountLayout