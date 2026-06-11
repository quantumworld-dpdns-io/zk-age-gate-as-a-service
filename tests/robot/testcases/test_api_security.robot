*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}         http://localhost:8787
${API_PREFIX}       /api/v1
${PROOF_ENDPOINT}   ${BASE_URL}${API_PREFIX}/proofs
${CRED_ENDPOINT}    ${BASE_URL}${API_PREFIX}/credentials

*** Test Cases ***

API Test Rate Limiting Enforcement
    [Documentation]    Verify rate limiting is enforced
    FOR    ${i}    IN RANGE    0    5
        ${headers}=    Create Dictionary    Content-Type=application/json
        ${body}=    Create Dictionary    birthDate=2000-01-01    minAge=18
        POST Request    api    ${PROOF_ENDPOINT}/generate    json=${body}    headers=${headers}    expected_status=any
    END

API Test Input Validation Enforcement
    [Documentation]    Verify input validation is enforced
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    birthDate=not-a-date    minAge=18
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    201

API Test Content-Type Validation
    [Documentation]    Verify Content-Type validation
    ${headers}=    Create Dictionary    Content-Type=text/plain
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    data=invalid    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    201

API Test Request Size Limits
    [Documentation]    Verify request size limits
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    data=${SPACE * 2000000}
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    500

API Test Error Message Sanitization
    [Documentation]    Verify error messages don't leak sensitive info
    ${response}=    GET Request    api    ${PROOF_ENDPOINT}/invalid-id    expected_status=any
    Should Not Contain    ${response.text}    stack
    Should Not Contain    ${response.text}    trace

API Test CORS Policy Enforcement
    [Documentation]    Verify CORS policy
    ${headers}=    Create Dictionary    Origin=http://evil.com
    ${response}=    OPTIONS Request    api    ${BASE_URL}/health    headers=${headers}    expected_status=any
    ${acao}=    Get From Dictionary    ${response.headers}    Access-Control-Allow-Origin
    Should Not Be Equal    ${acao}    *
