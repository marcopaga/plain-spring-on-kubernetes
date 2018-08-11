# Plain Spring Boot App on Kubernetes with the istio service mesh

This projects deploys two microservices in kubernetes and interconnects these with the istio [service mesh](https://istio.io)


# Installation on minikube

Follow these links to install istio in a new minikube cluster. Once you follow these steps you have a setup with automatic sidecar injection.
The infrastructure of istio is automatically injected into the pod. So you don't need to extend your configuration to benefit from istio.

https://istio.io/docs/setup/kubernetes/download-release/

https://istio.io/docs/setup/kubernetes/platform-setup/minikube/
https://istio.io/docs/setup/kubernetes/helm-install/#installation-steps
https://istio.io/docs/setup/kubernetes/helm-install/#option-2-install-with-helm-and-tiller-via-helm-install

# Enable automatic sidecar injection

After following the installation steps istio is deployed and can automatically inject the sidecars into the pod.
This needs to be enabled by setting the istio-injection=enabled - Label to the needed namespace.

```
kubectl label namespace default istio-injection=enabled
```

# Deploy the app

```
helm upgrade test . -i -w
```

# Access the app

The ingress controller will expose the service at http://frontend.minikube.local .

Check the status of the istio mesh.  You should see your pods in the overview:

```
istioctl proxy-status
```

Sample output:

````
➜  istio istioctl proxy-status
PROXY                                                 CDS        LDS        EDS               RDS          PILOT                            VERSION
istio-egressgateway-6cff45b4db-4wzsz.istio-system     SYNCED     SYNCED     SYNCED (100%)     NOT SENT     istio-pilot-6cd95f9cc4-9vwk7     1.0.0
istio-ingressgateway-fc648887c-j978j.istio-system     SYNCED     SYNCED     SYNCED (100%)     NOT SENT     istio-pilot-6cd95f9cc4-9vwk7     1.0.0
sleep-86f6b99f94-g67fc.default                        SYNCED     SYNCED     SYNCED (100%)     SYNCED       istio-pilot-6cd95f9cc4-9vwk7     1.0.0
test-plain-backend-7987b6c8cf-dc8vd.default           SYNCED     SYNCED     SYNCED (100%)     SYNCED       istio-pilot-6cd95f9cc4-9vwk7     1.0.0
test-plain-backend-7987b6c8cf-kw9n2.default           SYNCED     SYNCED     SYNCED (100%)     SYNCED       istio-pilot-6cd95f9cc4-9vwk7     1.0.0
test-plain-frontend-7db44ffbd-7skvq.default           SYNCED     SYNCED     SYNCED (100%)     SYNCED       istio-pilot-6cd95f9cc4-9vwk7     1.0.0
test-plain-frontend-7db44ffbd-lnhhp.default           SYNCED     SYNCED     SYNCED (100%)     SYNCED       istio-pilot-6cd95f9cc4-9vwk7     1.0.0
```

Follow along the logs to see istio in action. You can use a tool like [kail](https://github.com/boz/kail) to see all log messages in one place.