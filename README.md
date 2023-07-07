# NextJS & AWS CDK: Fullstack Google Authentication Flow

This repo is inspired by [Allen Helton's Tweet](https://twitter.com/AllenHeltonDev/status/1677099079468294146?s=20)

> "Does anyone have an example of hooking up an @AWSAmplify app to cognito federated to Google NOT using the amplify CLI?

He's a fan of using [AWS SAM](https://aws.amazon.com/serverless/sam/), but this repo shows how it's done using the [AWS CDK](https://aws.amazon.com/cdk/) and [NextJS](https://nextjs.org/).

This project shows how one can create the frontend and backend resources needed so that user can sign in with Google.

## Backend Stack Overview

The CDK portion of things is made up of a single stack called `BackendStack`. This deploys several resources for us as shown in the `/backend/lib/cognito/auth.ts` file.

## Frontend Stack Overview

The NextJS side of things is much simpler. The heart of this app is the `frontend/amplifyConfig.ts`. This file shows the credentials needed by using real values (now destroyed).

After configuring Amplify as shown in the `frontend/pages/_app.tsx` file, the `Authenticator` component is used in the `frontend/pages/index.tsx` file.

```tsx
<Authenticator socialProviders={['google']}>
	{({ signOut, user }) => (
		<main>
			<h1>Hello {user?.username}</h1>
			<button onClick={signOut}>Sign out</button>
		</main>
	)}
</Authenticator>
```
