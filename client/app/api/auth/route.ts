import { NextResponse } from 'next/server';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

export async function POST(): Promise<Response> {
  try {
    const poolData = {
      UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || '',
      ClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID || '',
    };

    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username: process.env.AWS_COGNITO_USERNAME || '',
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    const authenticationData = {
      Username: process.env.AWS_COGNITO_USERNAME || '',
      Password: process.env.AWS_COGNITO_PASSWORD || '',
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise<Response>((resolve) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          const idToken = session.getIdToken().getJwtToken();
          resolve(
            NextResponse.json({
              success: true,
              token: idToken,
            })
          );
        },
        onFailure: (err) => {
          console.error('Authentication failed:', err);
          resolve(
            NextResponse.json(
              {
                success: false,
                error: err.message || 'Authentication failed',
              },
              { status: 401 }
            )
          );
        },
      });
    });
  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize authentication',
      },
      { status: 500 }
    );
  }
}
