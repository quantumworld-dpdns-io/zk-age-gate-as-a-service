*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    String
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}         http://localhost:8787
${API_PREFIX}       /api/v1
${PROOF_ENDPOINT}   ${BASE_URL}${API_PREFIX}/proofs

*** Test Cases ***

A03 Test SQL Injection In API Parameters
    [Documentation]    Verify SQL injection attempts are blocked
    ${body}=    Create Dictionary    birthDate=' OR '1'='1    minAge=18
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    500

A03 Test XSS Via Reflected Input
    [Documentation]    Verify XSS attempts are sanitized
    ${response}=    GET Request    api    ${BASE_URL}/health<script>alert(1)</script>    expected_status=any
    Should Not Contain    ${response.text}    <script>

A03 Test XSS Via Stored Input
    [Documentation]    Verify stored XSS is prevented
    ${body}=    Create Dictionary    birthDate=2000-01-01<script>alert(1)</script>    minAge=18
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Contain    ${response.text}    <script>

A03 Test Command Injection Attempts
    [Documentation]    Verify command injection is prevented
    ${body}=    Create Dictionary    birthDate=2000-01-01; rm -rf /    minAge=18
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    500

A03 Test LDAP Injection Attempts
    [Documentation]    Verify LDAP injection is prevented
    ${body}=    Create Dictionary    birthDate=2000-01-01    minAge=18*    countryCode=*)(uid=*
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    500

A03 Test XXE Injection
    [Documentation]    Verify XML External Entity injection is prevented
    ${headers}=    Create Dictionary    Content-Type=application/xml
    ${body}=    Set Variable    <?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>
    ${response}=    POST Request    api    ${PROOF_ENDPOINT}/generate    data=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    500
