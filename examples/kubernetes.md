# Kubernetes

```sh
# install kubectl
# install azure cli
$ az login
$ az aks get-credentials --resource-group=enablers-aks-rg --name=enablers-aks-cluster --admin

$ kubectl get nodes
$ kubectl cluster-info
$ kubectl get ns
$ kubectl get pods -n namaspaceName
$ kubectl logs -n namaspaceName --tail=1000 -f podName
$ kubectl exec -it -n namaspaceName podName sh
$ kubectl get pods -n namaspaceName | grep -i 7DD863D35E
$ kubectl get deploy -n namaspaceName

$ kubectl describe -n namaspaceName pod podName
$ kubectl delete -n namaspaceName pod podName
$ kubectl scale deployment -n namaspaceName --replicas=0 serviceName
$ kubectl get logs -n namaspaceName podName

# ssh #
$ cd ~/.ssh
$ ssh-keygen -t rsa: Creates id_rsa and id_rsa.pub
$ Enter passphrase (empty for no passphrase):
$ Enter same passphrase again:
$ cat id_rsa.pub
  - ssh-rsa AAAAB3NzaC1yc...

$ ssh _yaliz_@yaliz-identity-manager.serra.pw
```
