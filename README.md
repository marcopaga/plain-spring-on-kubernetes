# Plain Spring Boot App on Kubernetes with the istio service mesh

This projects deploys two microservices in a kubernetes cluster and interconnects these with the istio [service mesh](https://istio.io).

# But why?

We were pretty successful by setting up a Spring Cloud Netflix environment. You can find a sample application over [there](https://github.com/marcopaga/spring-cloud-netflix-demo). We could - without too much effort - create a scalable and fault tolerant application infrastructure. We could _stand on the shoulders of giants_ who put together the spring boot starters but we still had to put infrastructure logic in our code. We needed to deal explicitly with service discovery, failing requests and so much more in our code.

Istio takes another approach by providing a [sidecar proxy](https://istio.io/docs/setup/kubernetes/sidecar-injection/#injection) in every pod of the application. The application makes calls to those proxies that build the service mesh and move the infrastructure logic out of the microservices.

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

You can define an ingress resource to make the traffic available to the outside world. This is the imho easy way but you will miss important features.

So imho the prefered way to publish services is by using custom Istio resources. First we define a `Gateway` that handles the load balancing
and the second thing is a `VirtualService` that defines the routing logic.

You can find the relevant documentation over there: https://istio.io/docs/tasks/traffic-management/ingress/#configuring-ingress-using-an-istio-gateway

Then we need to find out how we can access the services. The istio ingress service is bound to a random node port that we need to find. You can simply run the following commands that will retrieve the information from the cluster.

```
KUBE_HOST=$(minikube ip)
ISTIO_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')

echo "http://$KUBE_HOST:$ISTIO_PORT"
```

You can open the page in a browser and see the app output.

# Istio proxy Status

Check the status of the istio mesh.  You should see your pods in the overview:

```
istioctl proxy-status
```

Sample output:

```
➜  istio istioctl proxy-status
PROXY                                                 CDS        LDS        EDS               RDS        PILOT                            VERSION
istio-egressgateway-6cff45b4db-4wzsz.istio-system     SYNCED     SYNCED     SYNCED (100%)     STALE      istio-pilot-6cd95f9cc4-9vwk7     1.0.0
istio-ingressgateway-fc648887c-j978j.istio-system     SYNCED     SYNCED     SYNCED (100%)     SYNCED     istio-pilot-6cd95f9cc4-9vwk7     1.0.0
sleep-86f6b99f94-g67fc.default                        SYNCED     SYNCED     SYNCED (100%)     SYNCED     istio-pilot-6cd95f9cc4-9vwk7     1.0.0
test-plain-backend-7987b6c8cf-bt7wr.default           SYNCED     SYNCED     SYNCED (100%)     SYNCED     istio-pilot-6cd95f9cc4-9vwk7     1.0.0
test-plain-backend-7987b6c8cf-m667s.default           SYNCED     SYNCED     SYNCED (100%)     SYNCED     istio-pilot-6cd95f9cc4-9vwk7     1.0.0
test-plain-frontend-7db44ffbd-k5jrj.default           SYNCED     SYNCED     SYNCED (100%)     SYNCED     istio-pilot-6cd95f9cc4-9vwk7     1.0.0
test-plain-frontend-7db44ffbd-rvtdt.default           SYNCED     SYNCED     SYNCED (100%)     SYNCED     istio-pilot-6cd95f9cc4-9vwk7     1.0.0
```

Follow along the logs to see istio in action. You can use a tool like [kail](https://github.com/boz/kail) to see all log messages in one place.