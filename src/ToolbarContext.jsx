import React, { createContext, useContext } from 'react'

export const ToolbarContext = createContext(null)

export const useToolbar = () => useContext(ToolbarContext)
