import '@/styles/globals.css'
import Topbar from "../components/topbar"

export default function Layout({ children }) {
  return (

      <main >
        <div>
          <Topbar/>
          {children}

        </div>
      </main>


      

  )
}
