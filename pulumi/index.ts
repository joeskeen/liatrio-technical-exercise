import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as kubernetes from "@pulumi/kubernetes";

// Grab some values from the Pulumi configuration (or use default values)
const config = new pulumi.Config();
const minClusterSize = config.getNumber("minClusterSize") || 1;
const maxClusterSize = config.getNumber("maxClusterSize") || 3;
const desiredClusterSize = config.getNumber("desiredClusterSize") || 1;
const eksNodeInstanceType = config.get("eksNodeInstanceType") || "t3.small";
const vpcNetworkCidr = config.get("vpcNetworkCidr") || "10.0.0.0/16";

// Create a new VPC
const eksVpc = new awsx.ec2.Vpc("eks-vpc", {
  enableDnsHostnames: true,
  cidrBlock: vpcNetworkCidr,
});

// Create the EKS cluster
const eksCluster = new eks.Cluster("eks-cluster", {
  // Put the cluster in the new VPC created earlier
  vpcId: eksVpc.vpcId,
  // Public subnets will be used for load balancers
  publicSubnetIds: eksVpc.publicSubnetIds,
  // Private subnets will be used for cluster nodes
  privateSubnetIds: eksVpc.privateSubnetIds,
  // Change configuration values to change any of the following settings
  instanceType: eksNodeInstanceType,
  desiredCapacity: desiredClusterSize,
  minSize: minClusterSize,
  maxSize: maxClusterSize,
  // Do not give the worker nodes public IP addresses
  nodeAssociatePublicIpAddress: false,
  // Uncomment the next two lines for a private cluster (VPN access required)
  // endpointPrivateAccess: true,
  // endpointPublicAccess: false
});
// initialize the EKS provider
const eksProvider = new kubernetes.Provider("eks-provider", {
  kubeconfig: eksCluster.kubeconfigJson,
});

// create the ECR
const repository = new awsx.ecr.Repository('repository', {});
// build and publish the app image
const image = new awsx.ecr.Image('image', { 
  repositoryUrl: repository.url, 
  path: '../service'
})

// deploy the app
const appClass = "app-deployment";
const appDeployment = new kubernetes.apps.v1.Deployment(
  "app-deployment",
  {
    metadata: { labels: { appClass } },
    spec: {
      replicas: 2,
      selector: { matchLabels: { appClass } },
      template: {
        metadata: { labels: { appClass } },
        spec: {
          containers: [
            {
              name: appClass,
              image: image.imageUri,
              ports: [
                {
                  name: "http",
                  containerPort: 3000,
                },
              ],
            },
          ],
        },
      },
    },
  },
  { provider: eksProvider }
);
// create the load balancer for public access
const myService = new kubernetes.core.v1.Service(
  "my-service",
  {
    metadata: { labels: { appClass } },
    spec: {
      type: "LoadBalancer",
      ports: [
        {
          port: 80,
          targetPort: "http",
        },
      ],
      selector: { appClass },
    },
  },
  { provider: eksProvider }
);

// Export some values for use elsewhere
export const kubeconfig = eksCluster.kubeconfig;
export const vpcId = eksVpc.vpcId;
// Export the URL for the load balanced service.
export const url = myService.status.apply((status) => {
  const hostname = status?.loadBalancer?.ingress[0]?.hostname;
  return `http://${hostname}`;
});
