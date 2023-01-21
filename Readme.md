# Liatrio Technical Exercise

A simple NodeJS service running in EKS.

## tl;dr one-liner

Run the following in Bash (WSL is OK):

```
bash ./deploy.sh
```

## Architecture

This diagram is meant to explain the general cloud infrastructure created by the Pulumi 
deployment for the K8s cluster.

![Application Infrastructure](https://www.pulumi.com/templates/kubernetes/aws/architecture.png)
*from <https://www.pulumi.com/templates/kubernetes/aws/>*

In addition to the resources represented above, the following are also provisioned:

* an ECR (Elastic Container Registry) for publishing/consuming the Docker image
* one container running the service application
* a publicly-accessible load balancer configured with DNS

## Development

### Prerequisites

This project has only ever been tested in a Linux environment (WSL2 Ubuntu). In theory, each of these tools should work in Windows or MacOS, but your mileage may vary.

- **NodeJS version 18.x**: Find the binaries for your platform at <https://nodejs.org/en/download/>
- **Docker**: Installation guide here: <https://docs.docker.com/engine/install/>
  - It's highly recommended that you configure Docker to be able to be run without using `sudo`, otherwise all of the other prerequisites must also be able to be run using `sudo`. Instructions for this can be found here: <https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user>
- **kubectl**: Follow the guide for your OS here: <https://kubernetes.io/docs/tasks/tools/#kubectl>
- **AWS CLI**: Installation guide here: <https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>
- **Pulumi**: Getting started guide: <https://www.pulumi.com/docs/get-started/install/>

### Local development

The following commands can be run from the `service` directory during development:

* `npm install`:  install application dependencies from NPM. This command is a prerequisite for running any other NPM command
* `npm start`: run the application locally
* `npm test`: run the unit tests
* `npm run docker:build`: build the Docker image
* `npm run docker:run`: run the application locally using Docker

### Deploying to AWS

From the `pulumi` directory, you can run the following commands:

* `pulumi up`: deploy the infrastructure to AWS. This command can be run multiple times for incremental deployments/updates.
* `pulumi down`: destroy the resources deployed in AWS

<!--
  Notes for Joe (in comments since they may not apply to others consuming this repository):

  * link to the AWS K8S console: https://us-east-2.console.aws.amazon.com/eks/home?region=us-east-2#/home
  * deployed application (link may change after destroying/redeploying though): http://ad92da514c52c402da5df8884c29b180-1678645955.us-east-2.elb.amazonaws.com/
  * pulumi stack dashboard: https://app.pulumi.com/joeskeen/liatrio-technical-exercise
-->
