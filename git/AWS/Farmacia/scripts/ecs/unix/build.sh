ECR_REGISTRY="855414917031.dkr.ecr.us-east-1.amazonaws.com"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker build -t aws-farmacia .
docker tag aws-farmacia:latest $ECR_REGISTRY:latest
docker push $ECR_REGISTRY:aws-farmacia:latest