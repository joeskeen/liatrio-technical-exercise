module "eks" {
  source                               = "terraform-aws-modules/eks/aws"
  cluster_name                         = local.cluster_name
  subnets                              = ["${module.vpc.private_subnets}"]
  tags                                 = local.tags
  vpc_id                               = module.vpc.vpc_id
  worker_groups_launch_template        = local.worker_groups_launch_template
  worker_group_launch_template_count   = "1"
  worker_group_count                   = "0"
  worker_additional_security_group_ids = ["${aws_security_group.all_worker_mgmt.id}"]
}
