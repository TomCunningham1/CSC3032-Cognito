import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  CfnIdentityPool,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito'

// Admin User Account
// tcunningham12@qub.ac.uk
// Passw()rd-1

class Team11CognitoStack extends Stack {

  public readonly userPoolId: CfnOutput
  public readonly userPoolClientId: CfnOutput
  public readonly identityPoolId: CfnOutput

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    // User pool to store admin users
    const userPool = new UserPool(
      this,
      `team11-user-pool`,
      {
        userPoolName: `team11-user-pool`,
        selfSignUpEnabled: false,
        // We don't want anyone adding admin users except via AWS console.
        autoVerify: { email: true },
        signInAliases: { email: true },
        removalPolicy: RemovalPolicy.DESTROY,
        passwordPolicy: {
          // Adjust the password policy as needed
          requireLowercase: true,
          requireUppercase: true,
          requireDigits: true,
          requireSymbols: true,
          minLength: 8,
          // Set the following to false to remove the force change password option
          tempPasswordValidity: Duration.days(0),
        },
      }
    )

    // Create user pool client to connect to website
    const userPoolClient = new UserPoolClient(
      this,
      `team11-user-pool-client`,
      {
        userPool,
        generateSecret: false,
      }
    )

    // Create identity pool
    // Allow unauthenticated users to allow non-admins to access the rest of the website
    const identityPool = new CfnIdentityPool(
      this,
      `team11-identity-pool`,
      {
        identityPoolName: `team11-identity-pool`,
        allowUnauthenticatedIdentities: true,
        cognitoIdentityProviders: [
          {
            clientId: userPoolClient.userPoolClientId,
            providerName: userPool.userPoolProviderName,
          },
        ],
        
      }
    )
  }
}

export default Team11CognitoStack
