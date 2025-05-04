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
                    
                    // Check if MongoDB is up and running
                    sh '''
                        attempt=1
                        max_attempts=10
                        
                        until docker exec mongodb mongo --eval "printjson(db.serverStatus())" > /dev/null 2>&1
                        do
                            if [ $attempt -eq $max_attempts ]
                            then
                                echo "MongoDB failed to start after $max_attempts attempts"
                                exit 1
                            fi
                            
                            echo "Waiting for MongoDB to be ready... (Attempt: $attempt/$max_attempts)"
                            sleep 5
                            attempt=$((attempt+1))
                        done
                        
                        echo "MongoDB is up and running"
                    '''
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    sh 'docker compose -f docker-compose.yml build backend'
                    sh 'docker compose -f docker-compose.yml up -d backend'
                    echo 'Backend container built and started'
                    
                    // Check if backend is up and running
                    sh '''
                        attempt=1
                        max_attempts=10
                        
                        until curl -s http://localhost:5000 > /dev/null
                        do
                            if [ $attempt -eq $max_attempts ]
                            then
                                echo "Backend failed to start after $max_attempts attempts"
                                exit 1
                            fi
                            
                            echo "Waiting for Backend to be ready... (Attempt: $attempt/$max_attempts)"
                            sleep 5
                            attempt=$((attempt+1))
                        done
                        
                        echo "Backend is up and running"
                    '''
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    sh 'docker compose -f docker-compose.yml build frontend'
                    sh 'docker compose -f docker-compose.yml up -d frontend'
                    echo 'Frontend container built and started'
                    
                    // Check if frontend is up and running
                    sh '''
                        attempt=1
                        max_attempts=10
                        
                        until curl -s http://localhost:3000 > /dev/null
                        do
                            if [ $attempt -eq $max_attempts ]
                            then
                                echo "Frontend failed to start after $max_attempts attempts"
                                exit 1
                            fi
                            
                            echo "Waiting for Frontend to be ready... (Attempt: $attempt/$max_attempts)"
                            sleep 5
                            attempt=$((attempt+1))
                        done
                        
                        echo "Frontend is up and running"
                    '''
                }
            }
        }
        
        stage('Seed Database') {
            steps {
                script {
                    // Run the seeder script to populate the database
                    sh '''
                        echo "Seeding database with sample data..."
                        docker exec backend node seeder.js
                        echo "Database seeding completed"
                    '''
                }
            }
        }
        
        stage('Run API Tests') {
            steps {
                script {
                    // Run the test.js script to test the APIs
                    sh '''
                        echo "Running API tests..."
                        docker exec backend node test.js > api_test_results.log
                        echo "API testing completed"
                        cat api_test_results.log
                    '''
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Deploy the application (this is a placeholder for actual deployment steps)
                    echo "Deploying the application..."
                    // Example: sh 'docker-compose -f docker-compose.prod.yml up -d'
                    echo "Deployment completed"
                }
            }
        }
    }
    
    post {
        always {
            // Archive test results
            archiveArtifacts artifacts: 'api_test_results.log', allowEmptyArchive: true
            
            // Only clean workspace files but keep containers running
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