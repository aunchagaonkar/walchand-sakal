pipeline {
    agent any
    
    environment {
        // environment variables from .env file
        MONGO_URI = 'mongodb://mongodb:27017/lecture-series'
        PORT = '5000'
        NODE_ENV = 'development'
        // credentials for sensitive information
        JWT_SECRET = credentials('walchand-jwt-secret')
        GEMINI_API_KEY = credentials('ai-api-key')
        MAILER_LITE_API = credentials('mailer-lite-api')
        // repository URL
        REPO_URL = 'https://github.com/aunchagaonkar/walchand-sakal.git'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Clone the repository from GitHub
                git url: "${REPO_URL}", branch: 'main'
                echo 'Checkout from GitHub repository completed'
            }
        }
        
        stage('Setup MongoDB') {
            steps {
                script {
                    sh 'docker compose -f docker-compose.yml up -d mongodb'
                    echo 'MongoDB container started'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    sh 'docker compose -f docker-compose.yml build backend'
                    sh 'docker compose -f docker-compose.yml up -d backend'
                    echo 'Backend container built and started'
                    
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    sh 'docker compose -f docker-compose.yml build frontend'
                    sh 'docker compose -f docker-compose.yml up -d frontend'
                    echo 'Frontend container built and started'
                }
            }
        }
        
        stage('Seed Database') {
            steps {
                script {
                    sh '''
                        echo "Seeding database with sample data..."
                        # Get the actual container name
                        BACKEND_CONTAINER=$(docker ps --filter "name=backend" --format "{{.Names}}")
                        docker exec $BACKEND_CONTAINER node seeder.js
                        echo "Database seeding completed"
                    '''
                }
            }
        }
        
        stage('Run API Tests') {
            steps {
                script {
                    sh '''
                        echo "Running API tests..."
                        # Get the actual container name
                        BACKEND_CONTAINER=$(docker ps --filter "name=backend" --format "{{.Names}}")
                        docker exec $BACKEND_CONTAINER node test.js > api_test_results.log
                        echo "API testing completed"
                        cat api_test_results.log
                    '''
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo "Deploying the application..."
                    sh 'docker compose -f docker-compose.yml up -d'
                    echo "Deployment completed"
                }
            }
        }
    }
    
    post {
        always {
            // archive test results
            archiveArtifacts artifacts: 'api_test_results.log', allowEmptyArchive: true
            
            cleanWs(cleanWhenNotBuilt: false, deleteDirs: true, disableDeferredWipeout: true)
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}