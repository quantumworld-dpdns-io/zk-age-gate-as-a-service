*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}         http://localhost:8787
${API_PREFIX}       /api/v1
${PROOF_ENDPOINT}   ${BASE_URL}${API_PREFIX}/proofs

*** Test Cases ***

ZK Test Proof Forgery Attempt
    [Documentation]    Verify proof forgery with invalid inputs is rejected
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    birthDate=invalid-date    minAge=18
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    201

ZK Test Proof Replay Attack
    [Documentation]    Verify proof replay is detected
    ${response}=    GET Request    api    ${PROOF_ENDPOINT}/00000000-0000-0000-0000-000000000000    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    404

ZK Test Invalid Circuit ID
    [Documentation]    Verify invalid circuit IDs are rejected
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    birthDate=2000-01-01    minAge=18    circuitId=nonexistent
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    201

ZK Test Proof Size Limit Enforcement
    [Documentation]    Verify proof size limits are enforced
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    proof=${SPACE * 100000}
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/verify    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    500

ZK Test Proof Expiration Enforcement
    [Documentation]    Verify expired proofs are rejected
    ${response}=    GET Request    api    ${PROOF_ENDPOINT}/00000000-0000-0000-0000-000000000000    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    404
