*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}    http://localhost:8787

*** Test Cases ***

Health Check Should Return OK
    [Documentation]    Verify health check endpoint
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200
    ${json}=    Evaluate    json.loads($response.text)    json
    Should Be Equal    ${json}[status]    ok

Version Should Return Version Info
    [Documentation]    Verify version endpoint
    ${response}=    GET Request    api    ${BASE_URL}/version    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200
    ${json}=    Evaluate    json.loads($response.text)    json
    Should Contain    ${json}    version
