// Next Imports
import type {Metadata} from 'next'

// Component Imports
import Login from '@views/soosmart/login/Login'

// Server Action Imports

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = async () => {
  // Vars

  return <Login/>
}

export default LoginPage
