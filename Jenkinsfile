pipeline {
    agent any

    environment {
        IMAGE_NAME = "college-registry/digital-card"
        IMAGE_TAG  = "${BUILD_NUMBER}"
        NAMESPACE  = "roll_2401002"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Code Quality Check') {
            steps {
                echo "Optional SonarQube stage"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "docker push $IMAGE_NAME:$IMAGE_TAG"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                kubectl apply -n $NAMESPACE -f k8s/
                """
            }
        }
    }
}
