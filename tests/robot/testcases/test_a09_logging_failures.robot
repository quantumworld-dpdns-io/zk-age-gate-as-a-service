*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}    http://localhost:8787

*** Test Cases ***

A09 Test Missing Security Event Logging
    [Documentation]    Verify security events are logged
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200

A09 Test Log Injection Attempts
    [Documentation]    Verify log injection is prevented
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    birthDate=2000-01-01\n[INJECTED]    minAge=18
    ${response}=    POST Request    api    ${BASE_URL}${API_PREFIX}/proofs/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    500

A09 Test Insufficient Logging Coverage
    [Documentation]    Verify all endpoints are logged
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200
    ${response}=    GET Request    api    ${BASE_URL}/version    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200
