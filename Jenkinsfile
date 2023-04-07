pipeline {
    agent any

    stages {
        stage('Deploy') {
            when {
                anyOf {
                    branch 'master'
                }
            }

            steps {
                echo 'Deploying...'
                sh 'sudo docker compose down'
                sh 'sudo docker compose up -d --build'
            }
        }
    }
}