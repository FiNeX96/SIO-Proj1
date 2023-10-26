README.md: contains the project description, authors, identifies vulnerabilities implemented;

## Project Description


## Vulnerabilities 


CWE-79: Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting') (https://cwe.mitre.org/data/definitions/79.html)

CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection') (https://cwe.mitre.org/data/definitions/89.html)

CWE-20: Improper Input Validation (https://cwe.mitre.org/data/definitions/20.html)

CWE-862: Missing Authorization (https://cwe.mitre.org/data/definitions/862.html)

CWE-287: Improper Authentication (https://cwe.mitre.org/data/definitions/287.html)

CWE-798: Use of Hard-coded Credentials (https://cwe.mitre.org/data/definitions/798.html)

CWE-306: Missing Authentication for Critical Function (https://cwe.mitre.org/data/definitions/306.html)

CWE-276: Incorrect Default Permissions (https://cwe.mitre.org/data/definitions/276.html)

CWE-200: Exposure of Sensitive Information to an Unauthorized Actor (https://cwe.mitre.org/data/definitions/200.html)

CWE-522: Insufficiently Protected Credentials (https://cwe.mitre.org/data/definitions/522.html)


## How to Run 

### Install Docker

    Install docker on your computer, refer to https://docs.docker.com/engine/install/ubuntu/

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

### Description

    Este é um projeto de desenvolvimento de uma loja do DETI da Universidade de Aveiro. A nossa principal missão neste projeto foi uma loja online funcional que oferece produtos relacionados com o Departamento de Eletrónica, Telecomunicações e Informática (DETI). No entanto, o que torna este projeto único é a introdução controlada de vulnerabilidades de segurança, que não são imediatamente evidentes para o utilizador comum.

    Os nossos objetivos incluem:

- Desenvolver uma versão da loja online com falhas e outra versão corrigida.
- Documentar minuciosamente as vulnerabilidades introduzidas, explorar como podem ser usadas e analisar o seu impacto.
- Concentrar-nos na compreensão e correção de vulnerabilidades comuns, como Cross-Site Scripting e Injeção SQL.
- Abordar a importância da segurança em aplicações de software.

## Authors

- Rodrigo Aguiar nmec 108969
- Tomás Matos nmec 108624
- Gonçalo Ferreira nmec 107853
- Diogo Almeida nmec 108902



