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
                input message: 'Finished using the web site? (Click "Proceed" to continue)'
                sh './Jenkins/scripts/kill.sh'
            }
        }
    }
}