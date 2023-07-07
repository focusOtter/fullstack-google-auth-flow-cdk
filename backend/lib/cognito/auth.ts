import { Construct } from 'constructs'
import * as awsCognito from 'aws-cdk-lib/aws-cognito'
import {
	IdentityPool,
	UserPoolAuthenticationProvider,
} from '@aws-cdk/aws-cognito-identitypool-alpha'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'

type CDKContext = {
	appName: string
	auth: {
		google: {
			clientSecret: string
			clientId: string
			callbackUrls: string[]
			logoutUrls: string[]
		}
		userpoolDomainPrefix: string
	}
}

export function createGoogleAuth(scope: Construct, context: CDKContext) {
	// create a bare bones user pool since users with auth via google
	const userPool = new awsCognito.UserPool(
		scope,
		`${context.appName}-userpool`,
		{
			userPoolName: `${context.appName}-userpool`,
		}
	)

	// Define a user pool domain that will be used to host the sign in page (google needs this url)
	const userPoolDomain = new awsCognito.UserPoolDomain(
		scope,
		'UserPoolDomain',
		{
			userPool,

			cognitoDomain: {
				domainPrefix: context.auth.userpoolDomainPrefix, // Specify a unique domain prefix
			},
		}
	)

	// create a google identity provider.
	// when users sign up with google, they will be added to the userpool
	const googleSecretValue = new Secret(scope, 'GoogleClientSecret', {
		secretName: context.auth.google.clientSecret,
	})

	const googleProvider = new awsCognito.UserPoolIdentityProviderGoogle(
		scope,
		'GoogleProvider',
		{
			clientId: context.auth.google.clientId,
			clientSecretValue: googleSecretValue.secretValue, // Replace with your Google Client Secret
			scopes: ['openid', 'profile', 'email'],
			attributeMapping: {
				email: awsCognito.ProviderAttribute.GOOGLE_EMAIL,
				givenName: awsCognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
				familyName: awsCognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
				phoneNumber: awsCognito.ProviderAttribute.GOOGLE_PHONE_NUMBERS,
			},
			userPool,
		}
	)

	// a user pool client to allow us to do this on the frontend
	const userPoolClient = new awsCognito.UserPoolClient(
		scope,
		'UserPoolClient',
		{
			userPool,

			oAuth: {
				flows: {
					authorizationCodeGrant: true,
				},
				callbackUrls: context.auth.google.callbackUrls, // Replace with your actual callback URL
				logoutUrls: context.auth.google.logoutUrls, // Replace with your actual logout URL
			},
		}
	)

	//This is needed to make sure that the google provider is created before we add it to the userpool
	userPoolClient.node.addDependency(googleProvider)

	// Add our google identity provider to the user pool
	userPool.registerIdentityProvider(googleProvider)

	// Create an identity pool so that authenticated users are authorized to make calls
	//* 🗒️ You typically want to keep this in a separate file since other resources may need the .authenticatedRole and .unauthenticatedRole it returns
	const identityPool = new IdentityPool(
		scope,
		`${context.appName}-identityPool`,
		{
			identityPoolName: `${context.appName}-identityPool`,
			allowUnauthenticatedIdentities: true,
			authenticationProviders: {
				userPools: [
					new UserPoolAuthenticationProvider({
						userPool: userPool,
						userPoolClient: userPoolClient,
					}),
				],
			},
		}
	)

	return { userPoolDomain, userPool, identityPool, userPoolClient }
}
