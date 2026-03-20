import React from 'react'
import Modal from 'react-bootstrap/Modal'

import Toolbar from './Toolbar'

interface Props {
  showMobileDrawer: boolean
  setShowMobileDrawer: (value: boolean) => void
}

export default ({ showMobileDrawer, setShowMobileDrawer }: Props) => (
  <Modal
    show={showMobileDrawer}
    onHide={() => setShowMobileDrawer(false)}
    className='d-md-none'
    scrollable
  >
    <Modal.Header closeButton>
      <Modal.Title>工具栏</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Toolbar />
    </Modal.Body>
  </Modal>
)
