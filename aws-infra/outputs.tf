output "cluster_name" {
  value = aws_eks_cluster.cluster.name
}

output "cluster_endpoint" {
  value = aws_eks_cluster.cluster.endpoint
}

output "cluster_security_group" {
  value = aws_eks_cluster.cluster.vpc_config[0].cluster_security_group_id
}