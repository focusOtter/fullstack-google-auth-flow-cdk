import type { AppProps } from 'next/app'
import { Amplify } from 'aws-amplify'
import { AmplifyProvider } from '@aws-amplify/ui-react'
import { config } from '../amplifyConfig'

Amplify.configure(config)
export default function App({ Component, pageProps }: AppProps) {
	return (
		<AmplifyProvider>
			<Component {...pageProps} />
		</AmplifyProvider>
	)
}
