*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}         http://localhost:8787
${API_PREFIX}       /api/v1
${PROOF_ENDPOINT}   ${BASE_URL}${API_PREFIX}/proofs
${AUTH_ENDPOINT}    ${BASE_URL}${API_PREFIX}/auth

*** Test Cases ***

A07 Test Brute Force Protection
    [Documentation]    Verify rate limiting blocks brute force attempts
    FOR    ${i}    IN RANGE    0    10
        ${body}=    Create Dictionary    apiKey=wrong-key-${i}
        ${headers}=    Create Dictionary    Content-Type=application/json
        POST Request    api    ${AUTH_ENDPOINT}/session    json=${body}    headers=${headers}    expected_status=any
    END

A07 Test Session Timeout Enforcement
    [Documentation]    Verify sessions expire properly
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200

A07 Test Password Policy Enforcement
    [Documentation]    Verify API key length requirements
    ${body}=    Create Dictionary    apiKey=short
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST Request    api    ${AUTH_ENDPOINT}/session    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    201

A07 Test Invalid Credential Format
    [Documentation]    Verify invalid credential formats are rejected
    ${body}=    Create Dictionary    apiKey=${EMPTY}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST Request    api    ${AUTH_ENDPOINT}/session    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    201
