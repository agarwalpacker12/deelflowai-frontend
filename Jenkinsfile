pipeline {
    agent any
    tools {nodejs "nodejs"}
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Deliver') {
            steps {
                sh 'chmod -R +rwx ./Jenkins/scripts/deliver.sh'
                sh 'chmod -R +rwx ./Jenkins/scripts/kill.sh'
                sh './Jenkins/scripts/deliver.sh'
                sh './Jenkins/scripts/kill.sh'
            }
        }
    }
}