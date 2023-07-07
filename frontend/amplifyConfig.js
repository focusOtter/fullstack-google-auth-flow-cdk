export const config = {
	Auth: {
		identityPoolId: 'us-east-1:f88ded90-2274-44fa-97fb-92ea44a25b68',
		region: 'us-east-1',
		userPoolId: 'us-east-1_Vgqcn7ROT',
		userPoolWebClientId: '5lp5hfma18alo03fc663e5mkde',
		oauth: {
			domain: 'cdk-demo-domain-for-allen.auth.us-east-1.amazoncognito.com',
			scope: [
				'phone',
				'email',
				'profile',
				'openid',
				'aws.cognito.signin.user.admin',
			],
			redirectSignIn: 'http://localhost:3000/',
			redirectSignOut: 'http://localhost:3000/',
			responseType: 'code',
		},
	},
}
