*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource    api_keywords.robot
Resource    security_keywords.robot

Suite Setup    Create API Session

*** Variables ***
${BASE_URL}    http://localhost:8787
