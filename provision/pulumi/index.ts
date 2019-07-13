import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import {Deployment} from "@pulumi/kubernetes/apps/v1";
import {Ingress} from "@pulumi/kubernetes/extensions/v1beta1";
import {Service} from "@pulumi/kubernetes/core/v1";

const stack = pulumi.getStack();

const config = new pulumi.Config();

const namespace = "default";
const appName = "plain-spring";

const appLabels = {
    app: appName,
    stack: stack
};

function createDeployment(name:string, image:string) {
    return new Deployment(name, {
        metadata: {
          labels : appLabels,
           namespace: namespace
        },
        spec: {
            selector: { matchLabels: appLabels },
            replicas: 2,
            template: {
                metadata: { labels: appLabels },
                spec: {
                    containers: [
                        {name: name, image: image}]
                }
            }
        }
    });
}

function createService(name: string, labels:any , port:number) {
    return new Service(appName, {
        metadata: {
            labels: labels,
            namespace: namespace
        },
        spec: {
            type: "ClusterIP" ,
            clusterIP: "None",
            ports: [{port: port, targetPort: 0, protocol: "TCP"}],
            selector: appLabels
        }
    });
}

// Allocate an IP to the Deployment.
const backendService = createService('backend', appLabels, 8090);
const backendDeployment = createDeployment('backend',"marcopaga/plain-backend:1");


const ingress = new Ingress(appName, {
    metadata: {
        labels: appLabels,
        annotations: {
            "ingress.kubernetes.io/ssl-redirect": "true"
        },
        namespace: namespace
    },
    spec: {
        rules: [
            {
                host: 'pulumi.marco-paga.eu',
                http: {
                    paths: [{
                        path: '/',
                        backend: {
                            serviceName: backendService.metadata.name,
                            servicePort: 8090 }
                    }]
                }
        }]
    }
});
