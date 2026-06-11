*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}    http://localhost:8787

*** Test Cases ***

A10 Test SSRF Via Proof Generation
    [Documentation]    Verify SSRF attacks are prevented
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    birthDate=http://internal-service/admin    minAge=18
    ${response}=    POST Request    api    ${BASE_URL}${API_PREFIX}/proofs/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    200

A10 Test Internal Service Access Attempts
    [Documentation]    Verify internal service access is blocked
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    birthDate=169.254.169.254    minAge=18
    ${response}=    POST Request    api    ${BASE_URL}${API_PREFIX}/proofs/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    200

A10 Test Localhost Access Attempts
    [Documentation]    Verify localhost access is blocked
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    birthDate=localhost:8080    minAge=18
    ${response}=    POST Request    api    ${BASE_URL}${API_PREFIX}/proofs/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    200
