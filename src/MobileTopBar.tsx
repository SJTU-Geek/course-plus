import React from 'react'
import Button from 'react-bootstrap/Button'
import { Route } from 'react-router-dom'

import Navbar from './Navbar'

interface Props {
  setShowMobileDrawer: (val: boolean) => void
}

function DotsSvg() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      fill='currentColor'
      className='bi bi-three-dots'
      viewBox='0 0 16 16'
    >
      <path d='M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3' />
    </svg>
  )
}

export default ({ setShowMobileDrawer }: Props) => (
  <div className='d-flex d-md-none align-items-center'>
    <Route path='/:semester'>
      <Navbar />
    </Route>

    <Button
      variant='outline-dark'
      size='sm'
      className='ml-auto mb-3'
      onClick={() => setShowMobileDrawer(true)}
    >
      <DotsSvg />
    </Button>
  </div>
)
