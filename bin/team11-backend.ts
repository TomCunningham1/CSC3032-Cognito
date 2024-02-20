#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import Team11CognitoStack from '../lib/team11-cognito-stack'

const app = new cdk.App()

// Create Cognito Stack

new Team11CognitoStack(app, `team11-cognito-stack`, {
  env: {
    account: '394261647652',
    region: 'eu-west-1',
  },});