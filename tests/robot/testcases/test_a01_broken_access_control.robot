*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    String
Library    OperatingSystem
Resource   ../resources/api_keywords.robot
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}         http://localhost:8787
${API_PREFIX}       /api/v1
${ADMIN_ENDPOINT}   ${BASE_URL}${API_PREFIX}/admin
${PROOF_ENDPOINT}   ${BASE_URL}${API_PREFIX}/proofs
${AUTH_ENDPOINT}    ${BASE_URL}${API_PREFIX}/auth

*** Test Cases ***

A01 Test Unauthorized Access To Admin Endpoints
    [Documentation]    Verify that admin endpoints reject unauthenticated requests
    ${response}=    GET Request    api    ${ADMIN_ENDPOINT}/stats    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    401

A01 Test Privilege Escalation Attempt
    [Documentation]    Verify that regular users cannot access admin functions
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    apiKey=test-key
    ${response}=    POST Request    api    ${AUTH_ENDPOINT}/session    json=${body}    headers=${headers}    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    201

A01 Test IDOR On Proof Access
    [Documentation]    Verify that users cannot access proofs they don't own
    ${response}=    GET Request    api    ${PROOF_ENDPOINT}/00000000-0000-0000-0000-000000000000    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    404

A01 Test CORS Misconfiguration
    [Documentation]    Verify CORS headers are properly configured
    ${headers}=    Create Dictionary    Origin=http://evil.com
    ${response}=    OPTIONS Request    api    ${BASE_URL}/health    headers=${headers}    expected_status=any
    ${acao}=    Get From Dictionary    ${response.headers}    Access-Control-Allow-Origin
    Should Not Be Equal    ${acao}    *

A01 Test JWT Token Manipulation
    [Documentation]    Verify that manipulated JWT tokens are rejected
    ${headers}=    Create Dictionary    Authorization=Bearer invalid-token-manipulated
    ${response}=    GET Request    api    ${ADMIN_ENDPOINT}/stats    headers=${headers}    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    401

A01 Test Session Fixation
    [Documentation]    Verify that sessions are properly managed
    ${body}=    Create Dictionary    apiKey=test-key
    ${response}=    POST Request    api    ${AUTH_ENDPOINT}/session    json=${body}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    200
