
pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-southeast-2'
        AWS_ACCOUNT_ID = '237247511512'
        ECR_REPO = 'creamycrust'
        ECR_URI = '237247511512.dkr.ecr.ap-southeast-2.amazonaws.com/creamycrust'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $ECR_URI:$BUILD_NUMBER ./app
                    docker tag $ECR_URI:$BUILD_NUMBER $ECR_URI:latest
                '''
            }
        }

        stage('Login to AWS ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION |
                    docker login --username AWS --password-stdin $ECR_URI
                '''
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                    docker push $ECR_URI:$BUILD_NUMBER
                    docker push $ECR_URI:latest
                '''
            }
        }

        stage('Deploy on EC2') {
            steps {
                sh '''
                    docker pull $ECR_URI:latest
                    docker rm -f creamycrust-container || true
                    docker run -d \
                        --name creamycrust-container \
                        -p 3000:3000 \
                        $ECR_URI:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'CreamyCrust CI/CD Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
