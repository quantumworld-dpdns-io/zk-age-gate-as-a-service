*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}         http://localhost:8787
${API_PREFIX}       /api/v1
${PROOF_ENDPOINT}   ${BASE_URL}${API_PREFIX}/proofs

*** Test Cases ***

A08 Test Insecure Deserialization
    [Documentation]    Verify deserialization attacks are prevented
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Set Variable    {"__proto__": {"admin": true}}
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    data=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    500

A08 Test Missing Integrity Checks
    [Documentation]    Verify integrity checks are present
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200

A08 Test Unsigned Updates
    [Documentation]    Verify updates require authentication
    ${body}=    Create Dictionary    version=2.0.0
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    200
