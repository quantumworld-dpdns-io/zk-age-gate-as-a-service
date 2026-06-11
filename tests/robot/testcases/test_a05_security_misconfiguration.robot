*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource   ../resources/security_keywords.robot

*** Variables ***
${BASE_URL}    http://localhost:8787

*** Test Cases ***

A05 Test Missing Security Headers
    [Documentation]    Verify security headers are present
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    200
    ${headers}=    Set Variable    ${response.headers}
    Dictionary Should Contain Key    ${headers}    X-Content-Type-Options
    Dictionary Should Contain Key    ${headers}    X-Frame-Options
    Dictionary Should Contain Key    ${headers}    Strict-Transport-Security

A05 Test CSP Header
    [Documentation]    Verify Content Security Policy header
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    ${headers}=    Set Variable    ${response.headers}
    Dictionary Should Contain Key    ${headers}    Content-Security-Policy

A05 Test HSTS Header
    [Documentation]    Verify HTTP Strict Transport Security header
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    ${headers}=    Set Variable    ${response.headers}
    Dictionary Should Contain Key    ${headers}    Strict-Transport-Security
    ${hsts}=    Get From Dictionary    ${headers}    Strict-Transport-Security
    Should Contain    ${hsts}    max-age=31536000

A05 Test X-Content-Type-Options
    [Documentation]    Verify X-Content-Type-Options header
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    ${headers}=    Set Variable    ${response.headers}
    ${xcto}=    Get From Dictionary    ${headers}    X-Content-Type-Options
    Should Be Equal    ${xcto}    nosniff

A05 Test X-Frame-Options
    [Documentation]    Verify X-Frame-Options header
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    ${headers}=    Set Variable    ${response.headers}
    ${xfo}=    Get From Dictionary    ${headers}    X-Frame-Options
    Should Be Equal    ${xfo}    DENY

A05 Test Permissions-Policy
    [Documentation]    Verify Permissions-Policy header
    ${response}=    GET Request    api    ${BASE_URL}/health    expected_status=any
    ${headers}=    Set Variable    ${response.headers}
    Dictionary Should Contain Key    ${headers}    Permissions-Policy
