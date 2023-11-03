## Project Description

    This is a project for developing an online store for DETI at the University of Aveiro. 
    Our primary mission in this project was to create a functional online store offering 
    products related to the Department of Electronics, Telecommunications, and Informatics (DETI). 
    However, what makes this project unique is the controlled introduction of 
    security vulnerabilities that are not immediately apparent to the average user.

    Our objectives include:

    - Developing both a flawed and a corrected version of the online store.
    - Thoroughly documenting the introduced vulnerabilities, exploring how they can be exploited, and analyzing their impact.
    - Focusing on understanding and correcting common vulnerabilities, such as Cross-Site Scripting and SQL Injection.
    - Addressing the importance of security in software applications.

## Implementation

    This project was developed with :

    - Flask for the API/backend
    - HTML, CSS, JS for the frontend
    - Sqlite3 for the database
    - Docker for containerization

## Vulnerabilities 

CWE-79: Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting') (https://cwe.mitre.org/data/definitions/79.html)

CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection') (https://cwe.mitre.org/data/definitions/89.html)

CWE-20: Improper Input Validation (https://cwe.mitre.org/data/definitions/20.html)

CWE-862: Missing Authorization (https://cwe.mitre.org/data/definitions/862.html)

CWE-287: Improper Authentication (https://cwe.mitre.org/data/definitions/287.html)

CWE-798: Use of Hard-coded Credentials (https://cwe.mitre.org/data/definitions/798.html)

CWE-311 : Missing Encryption of Sensitive Data (https://cwe.mitre.org/data/definitions/311.html)

CWE-306: Missing Authentication for Critical Function (https://cwe.mitre.org/data/definitions/306.html)

CWE-200: Exposure of Sensitive Information to an Unauthorized Actor (https://cwe.mitre.org/data/definitions/200.html)

CWE-522: Insufficiently Protected Credentials (https://cwe.mitre.org/data/definitions/522.html)

CWE-620 : Unverified Password Change (https://cwe.mitre.org/data/definitions/620.html)

CWE-1391 : Use of Weak Credentials (https://cwe.mitre.org/data/definitions/1391.html)

CWE-52 : Weak Password Requirements (https://cwe.mitre.org/data/definitions/521.html)

CWE-256 : Plaintext storage of a Password (https://cwe.mitre.org/data/definitions/256.html)

CWE-829: Inclusion of Functionality from Untrusted Control Sphere (https://cwe.mitre.org/data/definitions/829.html)


## How to Run 

### Install Docker

    Install docker on your computer, refer to https://docs.docker.com/engine/install/

### Insecure app 

    - Move to the app/ directory
    - Run 'docker-compose up --build'
    - Open your browser and go to http://localhost:8000/ ( if it doesnt automatically open )
    - docker-compose down to stop the container

### Secure app

    - Make sure to stop the previous container as api is using the same port
    - Move to the app_sec/ directory
    - Run 'docker-compose up --build'
    - Open your browser and go to http://localhost:9000/ ( if it doesnt automatically open )
    - docker-compose down to stop the container


## Authors

- Rodrigo Aguiar nmec 108969
- Tomás Matos nmec 108624
- Gonçalo Ferreira nmec 107853
- Diogo Almeida nmec 108902



