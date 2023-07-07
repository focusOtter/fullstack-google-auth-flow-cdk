import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createGoogleAuth } from './cognito/auth'

export class BackendStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props)
		const appNameContext = this.node.tryGetContext('appName')
		const authContext = this.node.tryGetContext('auth')
		const context = { appName: appNameContext, auth: authContext }

		const auth = createGoogleAuth(this, context)

		new CfnOutput(this, 'UserPoolDomainUrl', {
			value: `https://${auth.userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com`,
		})
		new CfnOutput(this, 'AuthorizedRedirectUserPoolDomainURL', {
			value: `https://${auth.userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com/oauth2/idpresponse`,
		})

		new CfnOutput(this, 'UserPoolId', {
			value: auth.userPool.userPoolId,
		})
		new CfnOutput(this, 'UserPoolWebClient', {
			value: auth.userPoolClient.userPoolClientId,
		})
		new CfnOutput(this, 'IdentityPoolId', {
			value: auth.identityPool.identityPoolId,
		})

		new CfnOutput(this, 'Region', {
			value: this.region!,
		})
	}
}
