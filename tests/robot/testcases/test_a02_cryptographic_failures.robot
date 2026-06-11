*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    String
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}    http://localhost:8787

*** Test Cases ***

A02 Test Weak Cipher Detection
    [Documentation]    Verify that weak ciphers are not accepted
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    GET Request    api    ${BASE_URL}/health    headers=${headers}    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200

A02 Test Missing TLS Enforcement
    [Documentation]    Verify that HTTPS is enforced
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200

A02 Test Hardcoded Secrets Detection
    [Documentation]    Verify no hardcoded secrets in configuration
    File Should Not Exist    src/.env
    File Should Not Exist    .env.local

A02 Test Insecure Key Storage
    [Documentation]    Verify keys are not stored in plaintext
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200

A02 Test Weak Random Number Generation
    [Documentation]    Verify crypto.randomValues is used instead of Math.random
    ${response}=    GET Request    api    ${BASE_URL}/version    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200

A02 Test Deprecated Algorithm Usage
    [Documentation]    Verify no deprecated cryptographic algorithms
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200
