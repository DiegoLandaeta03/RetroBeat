import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'
import CustomName from './CustomName.jsx'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#242424",
        color: "white",
        fontFamily: "Raleway, sans-serif",
        fontWeight: "500"
      }
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: "Raleway, sans-serif",
        fontWeight: "600"
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
